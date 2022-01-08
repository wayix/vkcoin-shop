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
	"adminID": 274969784 // Айди администратора
};
config.qiwi = {
	"phone": 790000000, // Номер киви
	"key": "b204ad909b6e39585463edcaab94cf1b", // https://qiwi.com/api
	"timeCheck": 60 * 1e3, // Интервал проверки истории платежей (ms.)
	"comment": "Спасибо за продажу!" // Комментарий при переводе
}

config.options = {
	"vkcoin": {
		"key": "[=[MNQ-a-vpp=.k94rJkWqTdN7cm;Oljvh9PP,S6!WN,_xyL[g", // https://vk.com/coin#create_merchant
		"userId": 1, // Айди страницы с который получен ключ VKC и токен
		"token": "5113d1e2c472efa7b45582b9e4ed63433c1f17081968e52c08195a06e5800bd082afc30263a57902844e9" // https://vkhost.github.io/
	},
	"bot": {
		"token": "5113d1e2c472efa7b45582b9e4ed63433c1f17081968e52c08195a06e5800bd082afc30263a57902844e9", // Токен группы
		"apiMode": "parallel",
		"apiLimit": 20
	}
}

module.exports = config;
