const { Keyboard } = require('vk-io')

function PrivateKeyboard(user) {
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

module.exports = {
	PrivateKeyboard, redirectKeyboard, cancelKeyboard
}