import anthology from './services/Scenario'
import { availableScenarious } from './helpers/markup'
import { bot } from './bootstrap'
import { inBlockDate } from './utils'

bot.start(async (ctx: any) => {
  try {
    if (ctx.startPayload) {
      await anthology.get('addReferral')(ctx)(Number(ctx.startPayload))
    }
    await anthology.get('initial')(ctx)
  } catch (err) {
    console.log(err.message)
  }
})

bot.on('message', async ctx => {
  try {
    const userMessage = ctx.message.text
    if(inBlockDate()) {
      return await anthology.get('rejectRequest')(ctx)
    }
    if (userMessage.toLowerCase().startsWith('промокод:')) {
      return await anthology.get('applyPromocode')(ctx)(userMessage.substr(9).trim())
    }
    if (Object.values(availableScenarious).indexOf(userMessage) > -1) {
      for (const prop in availableScenarious) {
          if (availableScenarious.hasOwnProperty(prop)) {
            if (availableScenarious[prop] === userMessage) {
              return await anthology.get(prop)(ctx)
            }
          }
      }
    }
  } catch(err) {
    console.log(err.message)
  }
})

bot.on('callback_query', async ctx => {
  try {
    const callbackQuery = ctx.callbackQuery.data
    if(inBlockDate()) {
      await ctx.answerCbQuery()
      return await anthology.get('rejectRequest')(ctx)
    }
    if (callbackQuery.startsWith('diO:')) {
      return await anthology.get('discardOrder')(ctx)(callbackQuery.substr(4))
    }
    if (callbackQuery.startsWith('Z:')) {
      return await anthology.get('checkPayment')(ctx)(callbackQuery.substr(2))
    }
    if (callbackQuery.startsWith('pPBB:')) {
      // return await anthology.get('payProductByBonuses')(ctx)(callbackQuery.substr(5))
    }
    if (callbackQuery.startsWith('pP:')) {
      return await anthology.get('payProduct')(ctx)(callbackQuery.substr(3))
    }
    if (callbackQuery.startsWith('dO:')) {
      return await anthology.get('displayOrderDetails')(ctx)(callbackQuery.substr(3))
    }
    if (callbackQuery.startsWith('getAreasByProduct:')) {
      return await anthology.get('getAreasByProduct')(ctx)(callbackQuery.substr(18))
    }
    if (callbackQuery.startsWith('getProductsByCity:')) {
      return await anthology.get('getProductsByCity')(ctx)(callbackQuery.substr(18))
    }
    if (Object.values(availableScenarious).indexOf(callbackQuery) > -1) {
      for (const prop in availableScenarious) {
          if (availableScenarious.hasOwnProperty(prop)) {
            if (availableScenarious[prop] === callbackQuery) {
              return await anthology.get(prop)(ctx)
            }
          }
      }
    }
  } catch(err) {
    console.log(err.message)
  }
})