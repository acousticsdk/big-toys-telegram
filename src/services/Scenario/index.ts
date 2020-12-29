import Markup from 'telegraf/markup'
import axios from 'axios'
import inlineKeyboards from '../Keyboards/inlineKeyboard'
import papyrus from '../../stubs/papyrus'
import { availableScenarious } from '../../helpers/markup'
import { usersModel, placesModel, productsModel, historyModel, promocodeModel } from '../MongoDB'
import { bot } from '../../bootstrap'

// const busyWallets = []
let blockedButton = false;

const scenarious = {
  initial: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    const places = await placesModel.find({})
    if (user === null) {
      await usersModel.create({ userId: ctx.from.id, username: ctx.from.username, registrationDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), countOfPurchases: 0, referralFriends: [], bonusBalance: 0, historyOfPurchases: [] })
    }
    await ctx.reply(papyrus.initial)
    return await ctx.reply(papyrus.initialSecond, 
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
  },
  myProfile: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    return await ctx.editMessageText(papyrus.profile(ctx.from.username, ctx.from.id, user.countOfPurchases, user.registrationDate),
      Markup.inlineKeyboard(inlineKeyboards.profile)
        .resize()
        .extra()
    )
  },
  information: async ctx => {
    return await ctx.editMessageText(papyrus.information,
      Markup.inlineKeyboard(inlineKeyboards.back)
        .resize()
        .extra()
    )
  },
  back: async ctx => {
    const places = await placesModel.find({})
    return await ctx.editMessageText(papyrus.initialSecond,
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
  },
  systemOfDiscounts: async ctx => {
    const user = await usersModel.findOne({ userId: ctx.from.id })
    return await ctx.editMessageText(papyrus.discountSystem(user.referralFriends, user.bonusBalance, ctx.from.id),
      Markup.inlineKeyboard(inlineKeyboards.discountSystem)
        .resize()
        .extra()
    )
  },
  enterPromocode: async ctx => {
    return await ctx.reply(papyrus.enterPromocode)
  },
  historyOfPurchases: async ctx => {
    const history = await historyModel.find({ buyerId: ctx.from.id })
    return await ctx.editMessageText(papyrus.historyOfPurchases(history),
      Markup.inlineKeyboard(inlineKeyboards.secondBack)
        .resize()
        .extra()
    )
  },
  applyPromocode: ctx => async promocode => {
    const promo = await promocodeModel.findOne({ promo: promocode })
    if (promo) {
      await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { bonusBalance: promo.increaseValue } })
      await promocodeModel.deleteOne({ _id: promo._id })
      return await ctx.reply(papyrus.promocodeUsed(promo.increaseValue))
    }
    return await ctx.reply(papyrus.promocodeDoesNotExist)
  },
  getProductsByCity: ctx => async city => {
    const place = await placesModel.findById(city)
    const products = await productsModel.find({ city: place.city })
    return await ctx.editMessageText(papyrus.getProductsByCity,
      Markup.inlineKeyboard(inlineKeyboards.products(products))
        .resize()
        .extra()
    )
  },
  getAreasByProduct: ctx => async productId => {
    const product = await productsModel.findById(productId)
    return await ctx.editMessageText(papyrus.getAreasByProduct,
      Markup.inlineKeyboard(inlineKeyboards.areas(product.area, productId))
        .resize()
        .extra()
    )
  },
  displayOrderDetails: ctx => async rawAreaData => {
    const [area, productId] = rawAreaData.split(':')
    const product = await productsModel.findById(productId)
    const user = await usersModel.findOne({ userId: ctx.from.id })
    let isBonusBalanceMatch = false
    if (user.bonusBalance >= product.price) {
      isBonusBalanceMatch = true
    }
    return await ctx.editMessageText(papyrus.displayProductDetails(product.title, product.description, product.city, area),
      Markup.inlineKeyboard(inlineKeyboards.paymentMethod(product.price, area, isBonusBalanceMatch, user.bonusBalance, productId))
        .resize()
        .extra()
    )
  },
  discardOrder: ctx => async walletId => {
    const places = await placesModel.find({})
    // if (walletId !== 'NoWalletId') {
    //   busyWallets.splice(busyWallets.indexOf(walletId), 1)
    // }
    await ctx.editMessageText(papyrus.orderDiscarded)
    return await ctx.reply(papyrus.initialSecond,
      Markup.inlineKeyboard(inlineKeyboards.initial(places))
        .resize()
        .extra()
    )
  },
  // if (easypay.data.length === busyWallets.length) {
  //   return await ctx.answerCbQuery('На данный момент - все кошельки заняты! Попробуйте позже!')
  // }
  // busyWallets.push(wallet.id)
  payProduct: ctx => async rawAreaData => {
    const [area, productId, paymentMethod] = rawAreaData.split(':')
    const product = await productsModel.findById(productId)
    if (paymentMethod === 'gM') {
      const globalMoney = await axios.get(`${process.env.EASYPAY_URL}/walletGlobalMoney`)
      return await ctx.editMessageText(papyrus.payProduct(product.title, product.description, product.city, area, globalMoney.data.id, product.price),
        Markup.inlineKeyboard(inlineKeyboards.payProduct(Number(globalMoney.data.balance), globalMoney.data.id, productId, paymentMethod))
          .resize()
          .extra()
      )
    }
    if (paymentMethod === 'eP') {
      const easypay = await axios.get(`${process.env.EASYPAY_URL}/wallets`)
      const wallet = easypay.data[Math.floor(Math.random() * easypay.data.length)]
      return await ctx.editMessageText(papyrus.payProduct(product.title, product.description, product.city, area, wallet.number, product.price),
        Markup.inlineKeyboard(inlineKeyboards.payProduct(wallet.balance, wallet.id, productId, paymentMethod))
          .resize()
          .extra()
      )
    }    
  },
  payProductByBonuses: ctx => async productId => {
    // const product = await productsModel.findById(productId)
    // if (product === null) {
    //   return;
    // }
    // const stock = product.stock[Math.floor(Math.random() * product.stock.length)]
    // await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { countOfPurchases: 1, bonusBalance: Number(-Math.abs(product.price)) } })
    // await historyModel.create({ response: stock, buyerId: ctx.from.id, buyerUsername: ctx.from.username, price: product.price, date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') })
    // await productsModel.findByIdAndUpdate(productId, { stock: product.stock.filter(elem => elem !== stock) })
    // await ctx.editMessageText(papyrus.orderData(product.title, stock))
    // return await ctx.reply(papyrus.succesfulPayment,
    //   Markup.inlineKeyboard(inlineKeyboards.secondBack)
    //     .resize()
    //     .extra()
    // )
  },
  checkPayment: ctx => async rawProductData => {
    if (blockedButton) {
      blockedButton = false;
      return;
    }
    blockedButton = true
    const [oldBalance, walletId, productId, paymentMethod] = rawProductData.split(':')
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] })
    const product = await productsModel.findById(productId)
    if (product === null) {
      return;
    }
    if (paymentMethod === 'gM') {
      const globalMoney = await axios.get(`${process.env.EASYPAY_URL}/walletGlobalMoney`)
      if (Number((globalMoney.data.balance / 100).toFixed(2)) < Number((oldBalance / 100).toFixed(2)) + Number(product.price)) {
        await ctx.editMessageReplyMarkup({ inline_keyboard: inlineKeyboards.payProduct(oldBalance, walletId, productId, paymentMethod) })
        blockedButton = false
        return await ctx.answerCbQuery('Платёж не найден! Попробуйте позже!')
      }
    }
    if (paymentMethod === 'eP') {
      const easypay = await axios.get(`${process.env.EASYPAY_URL}/getWalletById`, { params: { walletId } })
      if (easypay.data[0].balance < Number(oldBalance) + Number(product.price) ) {
        await ctx.editMessageReplyMarkup({ inline_keyboard: inlineKeyboards.payProduct(oldBalance, walletId, productId, paymentMethod) })
        blockedButton = false
        return await ctx.answerCbQuery('Платёж не найден! Попробуйте позже!')
      }
    }
    // busyWallets.splice(busyWallets.indexOf(walletId), 1)
    const user = await usersModel.findOne({ userId: ctx.from.id })
    const stock = product.stock[0] // Math.floor(Math.random() * product.stock.length)
    if (user.inviterId) {
      await usersModel.findOneAndUpdate({ userId: user.inviterId }, { $inc: { bonusBalance: Math.round((2 / 100) * product.price) } }) 
    }
    await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { $inc: { countOfPurchases: 1 } })
    await historyModel.create({ response: stock, buyerId: ctx.from.id, buyerUsername: ctx.from.username, price: product.price, date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') })
    await productsModel.findByIdAndUpdate(productId, { stock: product.stock.filter(elem => elem !== stock) })
    await ctx.editMessageText(papyrus.orderData(product.title, stock))
    return await ctx.reply(papyrus.succesfulPayment,
      Markup.inlineKeyboard(inlineKeyboards.secondBack)
        .resize()
        .extra()
    )
  },
  addReferral: ctx => async inviterId => {
    const user = await usersModel.findOne({ userId: inviterId })
    if (user.referralFriends.indexOf(ctx.from.id) !== -1) {
      return;
    }
    await usersModel.findOneAndUpdate({ userId: ctx.from.id }, { inviterId })
    return await usersModel.findOneAndUpdate({ userId: inviterId }, { $push: { referralFriends: ctx.from.id } })
  },
  adminMakeMailing: async message => {
    const users = await usersModel.find({})
    return users.forEach(async user => {
      try {
        await bot.telegram.sendMessage(user.userId, message)
      } catch (err) {
        console.log(`User ${user.userId} is blocked bot.`);
      }
    })
  },
  rejectRequest: async ctx => {
    return await ctx.reply(papyrus.rejectRequest)
  },
  getServerTime: async ctx => {
    const date = new Date()
    return await ctx.reply(`${date.getUTCHours()} ${date.getUTCMinutes()}`)
  }
}

const anthology = new Map()
for (const scenario in availableScenarious) {
  if (Reflect.has(availableScenarious, scenario)) {
    anthology.set(scenario, scenarious[scenario])
  }
}

export default anthology