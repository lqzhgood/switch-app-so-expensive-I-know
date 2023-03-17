const nodemailer = require('nodemailer');


exports.DateFormart = function (fmt, date = new Date()) {
	let o = {
		"y+": date.getFullYear(),
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S+": date.getMilliseconds() //毫秒
	};
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			if (k == "y+") {
				fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
			} else if (k == "S+") {
				let lens = RegExp.$1.length;
				lens = lens == 1 ? 3 : lens;
				fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
			} else {
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
	}
	return fmt;
};


exports.email = function (subject, body, succ, error) {
	let transporter = nodemailer.createTransport({
		service: 'qq',
		auth: {
			user: 'lqzhmsg@qq.com',
			pass: 'nrmdbhtzbzntdcfg'
		}
	});

	let mailOptions = {
		from: 'lqzhmsg@qq.com',
		// to: ['289354781@qq.com', '301102885@qq.com', '1204993798@qq.com'],
		to: ['289354781@qq.com'],
		subject,
		//text: 'Hello world',
		html: body
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log('email err', err);
			error(err);
			return;
		} else {
			console.log('email succ', info);
			succ(info);
		}

	});
};
