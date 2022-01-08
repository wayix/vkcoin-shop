const User = require('../models/users.js');
const bot = require('../libs/vk.js');
const config = require('../libs/config.js');

const functions = {
    getUser: async function(id) {
        let user = await User.findOne({ uid: id }, { uid: 1, isAdmin: 1 }).lean()
        const { 0: userInfo } = await bot.api.users.get({ user_ids: id })
		
        if(!user) {
            user = new User({
                uid: id, 
                name: userInfo.first_name,
                isAdmin: id == config.bot.adminID ? true : false
			})
            
            await user.save()
		}
		
        return user;
	}
};

functions.utils = {
	random: {
        integer: (min, max) => {
			return Math.round(
				min - 0.5 + Math.random() * (max - min + 1)
			);
		},
		
		string: (length) => {
			let result           = '';
			let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let charactersLength = characters.length;
			
			for ( let i = 0; i < length; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			
			return result;
		}
	},
	split: (number) => {
		return number.toLocaleString('en-US').replace(/,/g, ' ')
	},
	declOfNum: (n, titles) => {
		return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
	}
}

module.exports = functions;