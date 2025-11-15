import { Bot, Keyboard } from '@maxhub/max-bot-api';
import { Student } from '../models/index.js';
import { createMockDataForStudent } from '../services/mockDataService.js';
import { getScheduleForDate, formatScheduleForText } from '../services/scheduleService.js';
import { getRatingSummary } from '../services/ratingService.js';

const EXPECTED_STUDENT_CODE = '11111'; // TODO: получить от внешнего сервиса
const pendingRegistrations = new Map();

function buildMainKeyboard() {
  return Keyboard.inlineKeyboard([
    [Keyboard.button.callback('Расписание', 'SCHEDULE_TODAY')],
    [Keyboard.button.callback('Рейтинг', 'RATING_CURRENT')],
  ]);
}

function getMessageText(ctx) {
  return ctx.update.message.body.text;
  if (typeof ctx.text === 'function') return ctx.text();
  if (ctx.message?.text) return ctx.message.text;
  if (ctx.update?.message?.text) return ctx.update.message.text;
  return '';
}

function getCallbackData(ctx) {
  return ctx.update.callback.payload;
  if (typeof ctx.callbackData === 'function') return ctx.callbackData();
  if (ctx.data) return ctx.data;
  if (ctx.update?.callback?.data) return ctx.update.callback.data;
  return '';
}

async function sendMessage(ctx, text, extra = {}) {
  if (typeof ctx.reply === 'function') return ctx.reply(text, extra);
  if (typeof ctx.sendText === 'function') return ctx.sendText(text, extra);
  if (typeof ctx.sendMessage === 'function') return ctx.sendMessage(text, extra);
  if (typeof ctx.send === 'function') return ctx.send(text, extra);
  return null;
}

async function sendMainMenu(ctx, text) {
  return ctx.reply(text, {attachments: [buildMainKeyboard()]}); //{ keyboard: buildMainKeyboard() }
}

async function handleStartCommand(ctx) {
  // const user = typeof ctx.user === 'function' ? ctx.user() : null;
  if (!ctx.user?.user_id) return;
  // console.log('y')ж
  const maxUserId = String(ctx.user?.user_id);
  const student = await Student.findOne({ where: { maxUserId } });
  if (student) {
    pendingRegistrations.delete(maxUserId);
    return sendMainMenu(ctx, 'С возвращением! Выберите действие на клавиатуре.');
    return;
  }
  pendingRegistrations.set(maxUserId, 'awaiting_code');
  await sendMessage(ctx, 'Введите код студента. Сейчас допустим только 11111.');
}

async function processRegistrationMessage(ctx, user, text) {
  const trimmed = text.trim();
  const maxUserId = String(user.user_id);
  if (trimmed !== EXPECTED_STUDENT_CODE) {
    await sendMessage(ctx, 'Неверный код, попробуйте ещё раз. Сейчас допустим только 11111.');
    return;
  }
  const student = await Student.create({
    maxUserId,
    studentCode: trimmed,
    firstName: user.first_name || user.firstName || '',
    lastName: user.last_name || user.lastName || '',
  });
  await createMockDataForStudent(student);
  pendingRegistrations.delete(maxUserId);
  await sendMainMenu(ctx, 'Регистрация завершена! Чем могу помочь?');
}

async function handleMessage(ctx) {
  // const user = typeof ctx.user === 'function' ? ctx.user() : null;
  if (!ctx.user?.user_id) return;
  const maxUserId = String(ctx.user?.user_id);
  const messageText = getMessageText(ctx);
  if (!messageText) return;
  if (pendingRegistrations.get(maxUserId) === 'awaiting_code') {
    console.log('y');
    await processRegistrationMessage(ctx, ctx.user, messageText);
    return;
  }
  const student = await Student.findOne({ where: { maxUserId } });
  if (!student) {
    await sendMessage(ctx, 'Используйте команду /start для регистрации.');
    return;
  }
  await sendMainMenu(ctx, 'Выберите действие на клавиатуре ниже.');
}

async function handleCallbacks(ctx) {
  // const user = typeof ctx.user === 'function' ? ctx.user() : null;
  if (!ctx.user?.user_id) return;
  const maxUserId = String(ctx.user?.user_id);
  const student = await Student.findOne({ where: { maxUserId } });
  if (!student) {
    await sendMessage(ctx, 'Сначала завершите регистрацию через /start.');
    return;
  }
  const data = getCallbackData(ctx);
  if (data === 'SCHEDULE_TODAY') {
    const today = new Date().toISOString().slice(0, 10);
    const lessons = await getScheduleForDate(student, today);
    await sendMessage(ctx, formatScheduleForText(lessons));
  } else if (data === 'RATING_CURRENT') {
    const rating = await getRatingSummary(student);
    await sendMessage(
      ctx,
      `Ваше место в потоке: ${rating.place}/${rating.total}\nКоличество очков: ${rating.points}`
    );
  } else {
    await sendMessage(ctx, 'Неизвестная команда.');
  }
  if (typeof ctx.answerCallback === 'function') {
    await ctx.answerCallback();
  }
}

let botInstance = null;

export function startBot() {
  if (!process.env.BOT_TOKEN) {
    console.warn('BOT_TOKEN is not provided. MAX bot не запущен.');
    return;
  }
  botInstance = new Bot(process.env.BOT_TOKEN);
  botInstance.api.setMyCommands([
    {
      name: 'start',
      description: 'Начать работу',
    },
  ]);
  botInstance.command('start', handleStartCommand);
  botInstance.on('bot_started', handleStartCommand);
  botInstance.on('message_created', handleMessage);
  botInstance.on('message_callback', handleCallbacks);

  botInstance.start();
}
