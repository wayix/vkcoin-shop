const config = {};

config.mongoose = {
	"uri": "mongodb://localhost:27017/demo",
	"options": {
		"keepAlive": 1,
		"autoIndex": false,
		"useNewUrlParser": true,
		"useUnifiedTopology": true
	}
};

config.bot = {
	"adminID": 274969784
};
config.qiwi = {
	"phone": 380635526923,
	"key": "b204ad909b6e39585463edcaab94cf1b",
	"timeCheck": 60 * 1e3,
	"comment": "Спасибо за продажу!"
}

config.options = {
	"vkcoin": {
		"key": "[=[MNQ-a-vpp=.k94rJkWqTdN7cm;Oljvh9PP,S6!WN,_xyL[g",
		"userId": 274969784,
		"token": "5113d1e2c472efa7b45582b9e4ed63433c1f17081968e52c08195a06e5800bd082afc30263a57902844e9"
	},
	"bot": {
		"token": "1293b40d77661e270eb053e165cc5197fd5f3e46ee868ac400c9ad96aac1d6f2966b467f189cd71d84c70",
		"apiMode": "parallel",
		"apiLimit": 20
	}
}

module.exports = config;