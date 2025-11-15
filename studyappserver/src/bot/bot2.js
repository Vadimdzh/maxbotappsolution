import { Bot } from '@maxhub/max-bot-api';
const bot = new Bot(process.env.BOT_TOKEN);

// Устанавливает список команд, который пользователь будет видеть в чате с ботом
bot.api.setMyCommands([
  {
    name: 'hello',
    description: 'Поприветствовать бота',
  },
]);

// Обработчик команды '/hello'

export function startBot(){
    bot.command('hello', (ctx) => {
        return ctx.reply('Привет! ✨');
    });
    bot.start();
}