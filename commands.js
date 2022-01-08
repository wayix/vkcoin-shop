
const bot = require('./libs/vk.js');
const vkcoin = require('./libs/vkcoin.js');
const qiwi = require('./libs/qiwi.js');
const exchangeRates = require('./libs/exchangeRates.js');
const { qiwi: { phone } } = require('./libs/config.js');

const User = require('./models/users.js');
const Payment = require('./models/payments.js');

const { privateKeyboard, redirectKeyboard, cancelKeyboard, adminKeyboard } = require('./utils/keyboard.js');
const { utils } = require('./utils/functions.js');

module.exports = [	
    {
       tag: ['начать', 'меню'],
       button: ['start'],
       
       type: 'TYPE_PRIVATE',
       
       async execute(context, { thisUser }) {
           await context.send('Добро пожаловать! 👋', { 
               keyboard: privateKeyboard(thisUser)
           })
       }
   },

    {
        tag: ['купить'],
        button: ['buy'],
        
        type: 'TYPE_PRIVATE',
        
        async execute(context, { thisUser }) {
            const vkcoinBalance = await vkcoin.api.getMyBalance() / 1e3;
            const { text: amount } = await context.question(
                'Для покупки введи сумму коинов которую желаешь приобрести.\n\n' +
                `Актуальный курс: ${exchangeRates.course.buy} ₽\n` + 
                `Доступное количество: ${utils.split(vkcoinBalance)} VKC`,
                { keyboard: cancelKeyboard }
            );

            if(!amount || isNaN(amount)) return context.send('Для ввода суммы покупки нужно использовать только числа.', { keyboard: privateKeyboard(thisUser) });

            else if(amount > vkcoinBalance) return context.send('Данного количества коинов у нас нет :(', { keyboard: privateKeyboard(thisUser) });
            
            const rubles = (+amount / 1e6 * exchangeRates.course.buy).toFixed(2);
            const shortUrl = (await bot.api.utils.getShortLink({ 
                url: `https://qiwi.com/payment/form/99?currency=643&extra[%27account%27]=${phone}&amountInteger=${rubles.toString().split('.')[0]}&amountFraction=00&extra[%27comment%27]comment=${context.senderId}&blocked[0]=comment&blocked[1]=account`
            })).short_url;

            await context.send(
                'Осталось только оплатить!\n\n' +
                `Сумма к оплате: ${rubles} ₽\n` + 
                `Оплатить: ${shortUrl}`,
                { 
                    keyboard: redirectKeyboard('Оплатить', shortUrl)
                }
            );
        }
    },

    {
        tag: ['продать'],
        button: ['sell'],
        
        type: 'TYPE_PRIVATE',
        
        async execute(context, { thisUser }) {
            if(thisUser.qiwi) return context.send('Для продажи коинов нужно указать свой кошелек.');

            const qiwiBalance = (await qiwi.getBalance()).accounts[0].balance.amount;
            const { text: amount } = await context.question(
                'Для продажи введи сумму коинов которую желаешь продать.\n\n' +
                `Актуальный курс: ${exchangeRates.course.sell} ₽\n` + 
                `Доступный баланс: ${utils.split(qiwiBalance)} ₽ (~${utils.split(qiwiBalance / exchangeRates.course.sell * 1e6)} VKC)`,
                { keyboard: cancelKeyboard }
            );
            
            if(!amount || isNaN(amount)) return context.send('Для ввода суммы покупки нужно использовать только числа.', { keyboard: privateKeyboard(thisUser) });
            
            const rubles = (amount / 1e6 * exchangeRates.course.sell * 0.97).toFixed(2);

            if(rubles > qiwiBalance) return context.send('На данный момент мы не можем купить такое количество коинов :(', { keyboard: privateKeyboard(thisUser) });
            else if(rubles < 1) return context.send('Минимальная сумма продажи 1 ₽', { keyboard: privateKeyboard(thisUser) });

            const url = await vkcoin.api.getLink(amount * 1000, true);
            const { short_url: shortUrl  } = await bot.api.utils.getShortLink({ 
                url
            });

            await context.send(
                'Осталось только перевести коины!\n\n' +
                `Вам будет отправлено: ${utils.split(rubles)} ₽\n` +
                `Оплатить: ${shortUrl}`,
                { 
                    keyboard: redirectKeyboard('Оплатить', shortUrl)
                }
            )
        }
    },

    {
        tag: ['информация'],
        button: ['information'],
        
        type: 'TYPE_PRIVATE',
        
        async execute(context, { }) {
            const [
                countUsers,
                payments,
                qiwiBalance,
                vkcoinBalance
            ] = await Promise.all([
                User.countDocuments(),
                Payment.find({}, { amount: 1 }).lean(),
                qiwi.getBalance(),
                vkcoin.api.getMyBalance()
            ]);
            const amountPayments = payments.map(payment => payment.amount);

            await context.send(
                'Актуальный курс:\n' +
                `➖ Покупка: ${exchangeRates.course.buy}\n` +
                `➖ Продажа: ${exchangeRates.course.sell}\n\n` +
                `Резерв:\n` +
                `Qiwi: ${utils.split(qiwiBalance.accounts[0].balance.amount)} ₽\n` +
                `VKCoin: ${utils.split(vkcoinBalance / 1e3)}\n\n` +
                'Информация о боте: \n' +
                `Всего юзеров: ${countUsers}\n` +
                `Всего платежей: ${utils.split(payments.length)} ₽\n` +
                `Общая сумма платежей: ${utils.split(amountPayments)}\n`
            )
        }
    },

    {
        tag: ['панель'],
        button: ['start'],
        
        type: 'TYPE_PRIVATE',
        
        async execute(context, { thisUser }) {
            if(!thisUser.isAdmin) return;

            await context.send('Панель', { 
                keyboard: adminKeyboard
            })
        }
    },

    {
        tag: ['settings'],
        button: ['settings'],

        type: 'TYPE_PRIVATE',

        async execute(context, { thisUser, command }) {
            if(!thisUser.isAdmin) return;
            const args = command.text.split('_')

            if(args[1] === 'course') {
                const { text: amount } = await context.question(
                    'Введи актуальный курс\n' +
                    `Сейчас: ${exchangeRates.course[args[2]]}`,
                    { keyboard: cancelKeyboard }
                );

                if(isNaN(amount)) return context.send('Сумма должна быть числом', { keyboard: adminKeyboard });

                exchangeRates.edit(args[2], amount);
                await context.send(
                    'Курс успешно изменен',
                    { keyboard: adminKeyboard }
                )
            }
        }
    }
]