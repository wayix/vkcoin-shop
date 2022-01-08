
const bot = require('./libs/vk.js');
const vkcoin = require('./libs/vkcoin.js');
const qiwi = require('./libs/qiwi.js');
const exchangeRates = require('./libs/exchangeRates.js');
const { qiwi: { phone } } = require('./libs/config.js');

const { PrivateKeyboard, redirectKeyboard, cancelKeyboard } = require('./utils/keyboard.js');
const { utils } = require('./utils/functions.js');

module.exports = [	
    {
       tag: ['начать', 'меню'],
       button: ['start'],
       
       type: 'TYPE_PRIVATE',
       
       async execute(context, { thisUser }) {
           await context.send('Добро пожаловать! 👋', { 
               keyboard: PrivateKeyboard(thisUser)
           })
       }
   },


    {
        tag: ['купить'],
        button: ['buy'],
        
        type: 'TYPE_PRIVATE',
        
        async execute(context, { thisUser }) {
            const vkcoinBalance = await vkcoin.api.getMyBalance();
            const { text: amount } = await context.question(
                'Для покупки введи сумму коинов которую желаешь приобрести.\n\n' +
                `Актуальный курс: ${exchangeRates.course.buy} ₽\n` + 
                `Доступное количество: ${utils.split(vkcoinBalance)} VKC`,
                { keyboard: cancelKeyboard }
            );

            if(!amount || isNaN(amount)) return context.send('Для ввода суммы покупки нужно использовать только числа.', { keyboard: PrivateKeyboard(thisUser) });

            else if(amount > vkcoinBalance) return context.send('Данного количества коинов у нас нет :(', { keyboard: PrivateKeyboard(thisUser) });
        
            const rubles = (+amount / 1e6 * exchangeRates.course.buy).toFixed(2);
            const shortUrl = (await bot.api.utils.getShortLink({ 
                url: `https://qiwi.com/payment/form/99?currency=643&extra[%27account%27]=${phone}&amountInteger=${rubles.toString().split('.')[0]}&amountFraction=00&extra[%27comment%27]${context.senderId}&blocked[0]=comment&blocked[1]=account`
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
            
            if(!amount || isNaN(amount)) return context.send('Для ввода суммы покупки нужно использовать только числа.', { keyboard: PrivateKeyboard(thisUser) });
            
            const rubles = (amount / 1e6 * exchangeRates.course.sell * 0.97).toFixed(2);

            if(rubles > qiwiBalance) return context.send('На данный момент мы не можем купить такое количество коинов :(', { keyboard: PrivateKeyboard(thisUser) });
            else if(rubles < 1) return context.send('Минимальная сумма продажи 1 ₽', { keyboard: PrivateKeyboard(thisUser) });

            const url = await vkcoin.api.getLink(amount * 1000, true);
            const { short_url: shortUrl  } = await bot.api.utils.getShortLink({ 
                url
            });

            await context.send(
                'Осталось только перевести коины!!\n\n' +
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
        
        async execute(context, { thisUser }) {
            
        }
    },
]