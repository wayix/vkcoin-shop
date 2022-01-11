const mongoose = require('../libs/mongoose');
const {
	Schema, model
} = mongoose;

const schema = new Schema({ 
	uid: { type: Number, required: true },
	name: { type: String, required: true },
	
	qiwi: { type: String, default: '' },

	isAdmin: { type: Boolean, default: false },
	isMessages: { type: Boolean, default: true },
	
	registerDate: { type: Date, default: Date.now }
});

schema.index(
    {uid: 1}, {unique: true, dropDups: true}
);

schema.statics = {
	updateItem: async function(uid, params) {
        const User = this;
        return await User.updateOne(
            { uid: uid },
            {$set: params}
        );
    },
}

module.exports = model('Accounts', schema);;