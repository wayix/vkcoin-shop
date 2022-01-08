const mongoose = require('mongoose');

const { 
    mongoose: { uri, options }  
} = require('./config.js');

mongoose.connect(uri, options);

module.exports = mongoose;