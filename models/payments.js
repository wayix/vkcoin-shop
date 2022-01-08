const mongoose = require('../libs/mongoose');
const {
	Schema, model
} = mongoose;

const schema = new Schema({ 
	txnId: { type: Number, unique: true, required: true  },
    amount: { type: Number, required: true }
});

schema.index(
    {txnId: 1}, {unique: true, dropDups: true}
);

const Payments = model('QiwiPayments', schema);
module.exports = Payments;