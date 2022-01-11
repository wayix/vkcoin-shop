const { Keyboard } = require('vk-io')

// ========================= function 

function privateKeyboard(user) {
	const buttons = Keyboard.builder()
	.textButton({
		label: 'Купить'
	})
	.textButton({
		label: 'Продать'
	})
	.row()
	
	.textButton({
		label: 'Информация'
	})
	.textButton({
		label: 'Профиль'
	})
	

	if(user.isAdmin) {
		buttons.row()
		buttons.textButton({
			label: 'Панель'
		});
	}
	
	return buttons;
}

function profileKeyboard(user) {
	const buttons = Keyboard.builder()

	.textButton({
		label: user.qiwi === '' 
		? 'Изменить номер'
		: 'Указать номер' // а мне так красивее 
	})
	.inline()

	return buttons;
}


function redirectKeyboard(label, url) {
	const buttons = Keyboard.builder()
	
	.urlButton({
		label, url
	})
	.row()

	.textButton({
		label: 'Меню',
	});

	return buttons
}

// ========================= нету их, выше смотри 

const cancelKeyboard = Keyboard.builder()
	.textButton({
		label: 'Отменить'
	})

const adminKeyboard = Keyboard.builder()
	.textButton({
		label: 'Курс продажи',
		payload: {
			command: 'settings_course_buy'
		}
	})
	.textButton({
		label: 'Курс покупки',
		payload: {
			command: 'settings_course_sell'
		}
	})
	.row()

	.textButton({
		label: 'Рассылка',
		payload: {
			command: 'settings_bulkMessaging'
		}
	})
	.textButton({
		label: 'DEBUG',
		payload: {
			command: 'settings_debug'
		}
	})
	.row()

	.textButton({
		label: 'Меню',
	})

module.exports = {
	privateKeyboard, redirectKeyboard, profileKeyboard, cancelKeyboard, adminKeyboard
}