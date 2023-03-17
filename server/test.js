const fs = require('fs')


let games = fs.readFileSync('./db/games.json');
games = JSON.parse(games)
console.log('games', games)
games.data.forEach((v) => {
	v.release = v.release.replace("January ", "1-").replace("February ", "2-").replace("March ", "3-").replace("April ", "4-").replace("May ", "5-").replace("June ", "6-").replace("July ", "7-").replace("August ", "8-").replace("September ", "9-").replace("October ", "10-").replace("November ", "11-").replace("December ", "12-").replace(/[a-z][a-z], /, "-").replace("Release date to be determined", "1-1-2999");
	v.release = new Date(v.release);
	if (v.release == "Invalid Date") {
		console.log('v', v)
	}
})

fs.writeFileSync('./db/games.json', JSON.stringify(games))
