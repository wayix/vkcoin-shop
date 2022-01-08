const { Qiwi } = require('node-qiwi-promise-api')
const  { qiwi: { key } } = require('./config.js')
 
const qiwi = new Qiwi(key)

module.exports = qiwi;