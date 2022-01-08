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
	"phone": 1,
	"key": "1",
	"timeCheck": 60 * 1e3,
	"comment": "Спасибо за продажу!"
}

config.options = {
	"vkcoin": {
		"key": "1",
		"userId": 1,
		"token": "1"
	},
	"bot": {
		"token": "1",
		"apiMode": "parallel",
		"apiLimit": 20
	}
}

module.exports = config;
