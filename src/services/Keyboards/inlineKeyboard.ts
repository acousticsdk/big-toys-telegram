import { chunks } from "../../utils"

export default {
  initial: (places) => {
    const keyboard = [
      [{ text: '👤 Мой профиль' , callback_data: 'myProfile' }],
      [{ text: '❓ Информация' , callback_data: 'information' }],
      [{ text: 'Связь с нами' , url: 'https://t.me/kr_fen2' }]
    ]
    chunks(places).forEach(item => {
      if (typeof item[1] === 'undefined') {
        return keyboard.unshift([{ text: item[0].city, callback_data: `getProductsByCity:${item[0]._id}` }])
      }
      keyboard.unshift([{ text: item[0].city, callback_data: `getProductsByCity:${item[0]._id}` }, { text: item[1].city, callback_data: `getProductsByCity:${item[1]._id}` }])
    });
    return keyboard;
  },
  back: [
    [{ text: '🔙 Назад', callback_data: 'back' }]
  ],
  secondBack: [
    [{ text: '⚫ Главное меню', callback_data: 'back' }]
  ],
  profile: [
    [{ text: '👥 Система скидок', callback_data: 'systemOfDiscounts' }],
    [{ text: '📅 История покупок', callback_data: 'historyOfPurchases' }],
    [{ text: '🔙 Назад', callback_data: 'back' }]
  ],
  discountSystem: [
    [{ text: '🎁 Ввести промокод', callback_data: 'enterPromocode' }], 
    [{ text: '⚫ Главное меню', callback_data: 'back' }],
  ],
  products: (products) => {
    const keyboard = [[{ text: '🔙 Назад', callback_data: 'back' }]]
    products.forEach(product => {
      if (product.stock.length === 0 || product.stock[0] === "") {
        return;
      }
      keyboard.unshift([{ text: product.title, callback_data: `getAreasByProduct:${product._id}` }])
    })
    return keyboard
  },
  areas: (areas, productId) => {
    const keyboard = [[{ text: '⚫ Главное меню', callback_data: 'back' }]]
    areas.forEach(area => {
      keyboard.unshift([{ text: area, callback_data: `dO:${area}:${productId}` }])
    })
    return keyboard
  },
  paymentMethod: (price, area, isBonusBalanceMatch, bonusBalance, productId) => {
    let keyboard = [
      [{ text: `🌍 GlobalMoney (${price} грн)`, callback_data: `pP:${area}:${productId}:gM` }, { text: `🔷 EasyPay (${price} грн)`, callback_data: `pP:${area}:${productId}:eP` }],
      [{ text: `✖ Отменить заказ`, callback_data: `diO:NoWalletId` }]
    ]
    // if (isBonusBalanceMatch) {
    //   keyboard = [
    //     [{ text: `🌍 GlobalMoney (${price} грн)`, callback_data: `pP:${area}:${productId}:gM` }, { text: `🔷 EasyPay (${price} грн)`, callback_data: `pP:${area}:${productId}:eP` }],
    //     [{ text: `Купить за бонусы (${bonusBalance} грн)`, callback_data: `pPBB:${productId}` }, { text: `✖ Отменить заказ`, callback_data: `diO:NoWalletId` }]
    //   ]
    // }
    return keyboard
  },
  payProduct: (oldBalance, walletId, productId, paymentMethod) => [
    [{ text: '✔ Проверить оплату', callback_data: `Z:${oldBalance}:${walletId}:${productId}:${paymentMethod}` }, { text: '✖ Отмена', callback_data: `diO:${walletId}` }]
  ]
}