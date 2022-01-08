const { Keyboard } = require('vk-io')

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
	

	if(user.isAdmin) {
		buttons.row()
		buttons.textButton({
			label: 'Панель'
		});
	}
	
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
		label: 'Меню',
	})

module.exports = {
	privateKeyboard, redirectKeyboard, cancelKeyboard, adminKeyboard
}