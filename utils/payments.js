const bot = require('../libs/vk.js');
const vkcoin = require('../libs/vkcoin.js');
const qiwi = require('../libs/qiwi.js');
const { qiwi: { timeCheck, comment } } = require('../libs/config.js')

const User = require('../models/users.js');
const Payment = require('../models/payments.js');

const { PrivateKeyboard } = require('./keyboard.js');
const { utils: { random } } = require('./functions.js');

const { course } = require('../libs/exchangeRates.js')

// ========================= vkcoin 

vkcoin.updates.onTransfer(async (event) => {
    const user = await User.findOne({ uid: event.fromId }, { uid: 1 }).lean();
    const amount = event.amount / 1e3;
    const rubles = (amount / 1e6 * course.sell * 0.97).toFixed(2);

    if(!user || rubles < 1) return;

    if(user.qiwi === '') {
        await vkcoin.api.sendPayment(user.uid, amount, true).catch(err => {
            console.log(err);
        });
        await bot.api.messages.send({
            peer_id: user.uid,
            message: 'Для продажи коинов нужно указать свой кошелек.',
            keyboard: PrivateKeyboard(user),
            random_id: random(-2e9, 2e9) // new Date().getTime()
        })
    }

    try {
        // Отправка рублей
        // {
        //     amount: rubles,
        //     comment: '',
        //     account: '+' + user.qiwi,
        // }

        await bot.api.messages.send({
            peer_id: user.uid,
            message: [
                `Мы успешно отправили вам ${rubles} ₽`,
                `Сумма продажи: ${utils.split(amount)} VKC\n`,
                '🍀 Спасибо за продажу'
            ].join('\n'),
            keyboard: PrivateKeyboard(user),
            random_id: random(-2e9, 2e9)
        })
    }

    catch (e) {
        // Обрабатываем ошибки
    }
})

// ========================= qiwi

setInterval(async() =>{
    const { data: response } = await qiwi.getOperationHistory({
        rows: 10,
        operation: 'IN',
        sources: ['QW_RUB']
    });

    response.map(async(operation) => {
        if(!operation.comment || isNaN(operation.comment)) return;

        const payment = await Payment.findOne({ txnid: operation.txnId }, { txnid: 1 }).lean();
        if(payment) return;

        const user = await User.findOne({ uid: operation.comment }, { uid: 1 }).lean();
        if(!user) return;

        const amount = (operation.sum.amount / course.buy * 1e6).toFixed(2);
        try {
            // Отправка коинов
    
            await bot.api.messages.send({
                peer_id: user.uid,
                message: [
                    `Мы нашли ваш платеж: ${utils.split(operation.sum.amount)} ₽`,
                    `Мы отправили вам: ${utils.split(amount)} VKC`,
                    '🍀 Спасибо за покупку'
                ].join('\n'),
                keyboard: PrivateKeyboard(user),
                random_id: random(-2e9, 2e9)
            })
        }
    
        catch (e) {
            // Обрабатываем ошибки
        }
    })

}, timeCheck)