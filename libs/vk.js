const { VK } = require('vk-io');
const { QuestionManager } = require('vk-io-question');
const questionManager = new QuestionManager();

const { options } = require('./config.js')

const bot = new VK(options.bot)

bot.updates.start(),
bot.updates.use(questionManager.middleware);

module.exports = bot;