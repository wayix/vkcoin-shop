const mongoose = require('../libs/mongoose');
const {
	Schema, model
} = mongoose;

const schema = new Schema({ 
	uid: { type: Number, required: true },
	name: { type: String, required: true },
	
	qiwi: { type: String, default: '' },

	isAdmin: { type: Boolean, required: true, default: false },
	isMessages: { type: Boolean, required: true, default: true },
	
	registerDate: { type: Date, default: Date.now }
});

schema.index(
    {uid: 1}, {unique: true, dropDups: true}
);

const Users = model('Accounts', schema);
module.exports = Users;