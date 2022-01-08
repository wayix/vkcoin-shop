const bot = require('./libs/vk.js');
const cmds = require('./commands.js')

const { 
	getUser, utils
} = require('./utils/functions.js');

const on_message = async(context) => {
	const startTime = new Date().getTime(); // Записываем время - во сколько пришло сообщение
	
	// Игнорируем группы
	if(context.isGroup || !context.text) return;
	
	// Удаление [club...|...] ( при использование кнопок в беседе )
	context.text = context.text.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();
	
	// Берем пользователя из базы данных, если его нету - регистрируем
	const { senderId } = context;
	const thisUser = await getUser(senderId)
	
	let command = null;
	for(const com of cmds) {
		
		const isChat = context.isChat ? 'TYPE_CONVERSATION' : 'TYPE_PRIVATE';
		if(com.type != 'TYPE_ALL' && com.type != isChat) {
			continue;
		}
		
		const { messagePayload, text } = context;
		const typeCommand = messagePayload && messagePayload.command ? 'button' : 'tag';
		const textCommand = messagePayload && messagePayload.command ? messagePayload.command : text;
		
		if(
			(typeof com[typeCommand] == "object" && !Array.isArray(com[typeCommand]) && com[typeCommand].test(textCommand))
			|| (new RegExp(`^\\s*(${com[typeCommand].join('|')})`, "i")).test(textCommand)
			) {
			command = { cmd: com, type: typeCommand, text: textCommand, params: textCommand.split(typeCommand === 'button' ? '_' : ' ').splice(1) };
			break;
		}
		
	}
	
	// Выполнение CMD
	try {
		if(command == null && !context.isChat) {
			return context.send(`Нет такой команды!`);
		}
		
		else if(command == null) {
			return;
		}
		
		await command.cmd.execute(context, { thisUser, command });
	}
	
	catch(e) {
		console.log(`Произошла ошибка!\n`, e);
		
		if(bot.adminID) {
			context.api.messages.send({
				peer_id: bot.adminID,
				message: `Ошибка у [id${context.senderId}|пользователя] ( ${context.text} )<br>${e.stack}`,
				random_id: utils.random.integer(-2e9, 2e9)
			})
		}
		
		await context.send(`Ошибка! Сообщите администратору`);
	}
	
	finally {
		// thisUser.save();
		
		console.log(`Команда была выполнена за ${new Date().getTime() - startTime} ms.`);
	}
	
}

bot.updates.on('message_new', on_message);

process.on('SIGINT', () =>{
	console.log('Работа бота завершена');
	process.exit();
});