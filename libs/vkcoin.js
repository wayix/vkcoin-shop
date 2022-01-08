const VKCOINAPI = require('node-vkcoinapi');
const { options } = require('./config.js')

const vkcoin = new VKCOINAPI(options.vkcoin);

vkcoin.updates.startPolling().catch(console.error)

module.exports = vkcoin;