const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

const utils = require('./utils.js');

const SALE = 0.9;
const STEP = 1 * 1000;

let SALE_ARR = [];
let SALE_ARR_LAST = [];


log4js.configure({
	appenders: {
		console: { type: 'console' },
		out: { type: 'file', filename: `./log/${utils.DateFormart("yyyyMMdd")}.log`, maxLogSize: 1024 * 1024 * 1000 }
	},
	categories: {
		default: { appenders: ['console', 'out'], level: 'debug' }
	}
});
let logger = log4js.getLogger();


try {
	logger.info('start');
	start();
} catch (e) {
	logger.error('start err ', e);
	setTimeout(() => {
		start();
	}, 60 * 1000);
}


async function start() {
	// get new
	let games = await getGames();
	if (!games) {
		console.log('get new games err');
		return;
	}
	logger.info('new games num - ', games.length);
	// get old
	let games_old = { data: [] };
	try {
		games_old = fs.readFileSync(path.join(__dirname, `./db/games.json`)).toString();
		games_old = JSON.parse(games_old).data;
	} catch (e) {
		logger.error(e);
		games_old = [];
	}
	// 合并
	games.forEach((v) => {
		games_old.some((k, i) => {
			if (v.name == k.name) {
				// 老的状态 赋值
				v.img = k.img;
				v.img_srcset = k.img_srcset;
				v.release = k.release;
				v.description = k.description;
				v.updatAt = k.updatAt;
				v.vl = k.vl;
				// 判断优惠是否还有效
				if (k.sale) {
					v.prices.some((v_ps) => {
						if (v_ps.country == k.sale.now.country && v_ps.price == k.sale.now.price) {
							v.sale = k.sale;
							SALE_ARR.push(v);
							return true;
						}
					});
				}

				if (v.l.length > 0 && k.l.length > 0) {
					// 最低价
					if (k.vl && k.vl.price) {
						if (v.l[0].price < k.vl.price) {
							v.vl = v.l[0];
						}
					} else {
						v.vl = v.l[0];
					}
					// 判断折扣
					if (v.l[0].price / k.l[0].price < SALE) {
						v.sale = {
							sale: v.l[0].price / k.l[0].price,
							now: v.l[0],
							old: k.l[0],
							time: new Date()
						};
						SALE_ARR_LAST.push(v);
					}
				}
				return true;
			}
		});
	});
	// make img
	await makeImg(games);
	// save
	fs.writeFileSync(path.join(__dirname, `./db/games.json`), JSON.stringify({ time: new Date, data: games }));
	// *** obj 被破坏
	let sale_html = '';
	SALE_ARR.forEach((v) => {
		let copy = `
			<img src="${v.img}" /> <br/>
			${v.name} <br/>
			${(v.sale.sale * 10).toFixed(1)}折 ￥${v.sale.now.price}/￥${v.sale.old.price} <br/>
			现在价格：￥${v.l[0].price} - ${v.l[0].country} - ${v.l[0].cHtml} <br/>
			历史最低：￥${v.vl.price} - ${v.vl.country} - ${v.vl.cHtml} - ${utils.DateFormart("yyyy-MM-dd hh:mm:ss",new Date(v.vl.time))}<br/>
			<a href=${v.url} target="_blank">eShop 详情</a> <br/>
			<a href="http://store.steampowered.com/search/?term=${v.name}" target="_blank">Steam 查询</a> <br/>
			<br/>
		`;
		sale_html += copy;
		delete v.prices;
	});
	fs.writeFileSync(path.join(__dirname, `./db/SALE.json`), JSON.stringify({ time: new Date, data: SALE_ARR }, null, 4));
	fs.writeFileSync(path.join(__dirname, `./db/SALE_HTML.html`), '<meta charset=utf-8>' + sale_html);
	// notice
	return;
	if (SALE_ARR_LAST.length > 0) {
		logger.info('email - ', SALE_ARR_LAST.length);
		let title = `switch - 打折啦! ${utils.DateFormart("yyyy-MM-dd.hh:mm:ss")}`;
		let html = '';
		SALE_ARR_LAST.forEach((v) => {
			v.l = v.l.splice(0, 1);
			v.h = v.h.splice(0, 1);
			let copy = `
				<img src="${v.img}" /> <br/>
				${v.name} <br/>
				${(v.sale.sale * 10).toFixed(1)}折 ￥${v.sale.now.price}/￥${v.sale.old.price} <br/>
				现在价格：￥${v.l[0].price} - ${v.l[0].country} - ${v.l[0].cHtml} <br/>
				历史最低：￥${v.vl.price} - ${v.vl.country} - ${v.vl.cHtml} - ${utils.DateFormart("yyyy-MM-dd hh:mm:ss",new Date(v.vl.time))}<br/>
				<a href=${v.url} target="_blank">eShop 详情</a> <br/>
				<a href="http://store.steampowered.com/search/?term=${v.name}" target="_blank">Steam 查询</a> <br/>
				<br/>
			`;
			html += copy;
			delete v.prices;
		});
		utils.email(title, html, (info) => {
			logger.info('success ', info);
		}, (err) => {
			logger.error('err ', err);
		});
		fs.writeFileSync(path.join(__dirname, `./db/SALE_LAST.json`), JSON.stringify({ time: new Date, data: SALE_ARR_LAST }, null, 4));
	}
	console.log('over');
	// console.log('games', games)
}


function getGames() {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://eshop-prices.com/?currency=CNY',
			timeout: 10 * 1000
		}, (err, res, body) => {
			if (err) {
				logger.error('getGames request err ', err);
				reject(err);
				return false;
			}
			let $ = cheerio.load(body);
			let country = ['Game'];
			let countryHtml = $("table thead th");
			for (let i = 1; i < countryHtml.length; i++) {
				let v = countryHtml[i];
				let obj = {
					country: $(v).attr('title'),
					cHtml: $(v).html()
				};
				country.push(obj);
			}
			// console.log('country', country)
			let games = [];
			let gameHtml = $("table tbody tr");
			for (let i = 0; i < gameHtml.length; i++) {
				let obj = { name: '', url: '', prices: [], l: [], h: [] };
				let gameName = $(gameHtml[i]).find("th");
				obj.name = $(gameName).text();
				obj.url = $(gameName).find("a").attr('href');
				let gameTds = $(gameHtml[i]).find("td");
				for (let j = 0; j < gameTds.length; j++) {
					let gameTd = gameTds[j];
					let priceObj = {
						country: country[j + 1].country,
						cHtml: country[j + 1].cHtml,
						price: $(gameTd).text().replace("¥", ""),
						time: new Date()
					};
					obj.prices.push(priceObj);
					// 最大和最小
					if ($(gameTd).hasClass("l")) {
						obj.l.push(priceObj);
					}
					if ($(gameTd).hasClass("h")) {
						obj.h.push(priceObj);
					}
				}
				games.push(obj);
			}
			resolve(games);
			// console.log('games', games)
			return games;
		});
	});
}
//img
async function makeImg(games) {
	let n = 0;
	for (let i = 0; i < games.length; i++) {
		let game = games[i];
		if (!game.img) {
			n++;
			await getImg(game, n);
			// 写入
			fs.writeFileSync(path.join(__dirname, `./db/games.json`), JSON.stringify({ time: new Date, data: games }));
			logger.info(`img update - ${i}/${games.length} - ${game.name}`);
		}
		// console.log('game', game)
	}
}

function getImg(v) {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			request({ url: v.url, timeout: 10 * 1000 }, (err, res, body) => {
				if (err) {
					logger.error('getImg request Err ', err);
					reject(err);
					return false;
				}
				let $ = cheerio.load(body);
				v.img = $(".game-hero-image").attr("src");
				v.img_srcset = $(".game-hero-image").attr("srcset");
				// v.updatAt = $("#updated-at").find("time").attr("datetime");
				v.description = $(".game-hero.hero .wrapper>div p").text();
				v.release = $(".wrapper small").text().replace("Released on ", "");
				v.release = v.release.replace("January ", "1-").replace("February ", "2-").replace("March ", "3-").replace("April ", "4-").replace("May ", "5-").replace("June ", "6-").replace("July ", "7-").replace("August ", "8-").replace("September ", "9-").replace("October ", "10-").replace("November ", "11-").replace("December ", "12-").replace(/[a-z][a-z], /, "-").replace("Release date to be determined", "1-1-2999");
				v.release = new Date(v.release);
				resolve();
				return true;
			});
		}, STEP);
	});

}
