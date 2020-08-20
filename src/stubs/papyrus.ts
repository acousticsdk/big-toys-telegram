export default {
  initial: 'Big Toys приветствует тебя, Друк !',
  initialSecond: '➖ Выберите ваш город для просмотра товаров',
  wallet: (wallets) => {
    let summaryString = 'Доступные кошельки: '
    wallets.forEach(wallet => {
      summaryString += `\n\nИмя: ${wallet.name}\nНомер: ${wallet.number}\nТип: ${wallet.walletType}\nБаланс: ${wallet.balance}`
    })
    return summaryString
  },
  profile: (username: string, userId: number, countOfPurchases: number, registrationDate: string) => `⚙️ Привет, ${username}

Ваш ID - #${userId}
Кол-во покупок - ${countOfPurchases} шт.
Дата регистрации - ${registrationDate}`,
  information: `Для покупки товара
-Выберете ваш город
-Выберете товар и район
-Нажмите 'Оплатить заказ'
-Следуйте указаниям
-Нажмите 'Я оплатил заказ'
* Вы получите товар автоматически если деньги поступили на кошелек
Контакты оператора - https://t.me/kr_fen2`,
  discountSystem: (referralFriends: any[], bonusBalance: number, userId: number) => `👥 Система скидок

Вы привели друзей - ${referralFriends.length} шт.
Ваш бонусный баланс - ${bonusBalance} грн.
Ваша реф. ссылка - https://t.me/big71_bot?start=${userId}

За каждую покупку вашего друга вы будете получать 2% от суммы его заказа.
Вы можете использовать реферальный баланс как скидку на покупку любого товара.`,
  enterPromocode: '💰Что-бы ввести промокод, напишите "Промокод:", и после двоеточия пропишите сам промокод.',
  historyOfPurchases: (historyOfPurchases: any[]) => {
    let summaryString = `📊 История ваших покупок (${historyOfPurchases.length} шт.)\n`
    if (historyOfPurchases.length === 0) {
      summaryString += '\nВы еще ничего не купили!'
    }
    historyOfPurchases.forEach(purchase => {
      summaryString += `\nТовар: ${purchase.response}\nДата: ${purchase.date}\nЦена: ${purchase.price} грн.\n`
    })
    return summaryString
  },
  promocodeDoesNotExist: '⛔️ Промокод не найден!',
  getProductsByCity: '➖ Выберите товар для просмотра районов',
  getAreasByProduct: '➖ Выберите удобный для вас район города',
  displayProductDetails: (title: string, description: string, city: string, area: string) => `${title}
Описание: ${description}
Город и район: ${city} (${area})

Товар зарезервирован, оплатите его в течении 30 минут
➖ Выберите способ оплаты товара:`,
  orderDiscarded: 'Ваш заказ успешно удален!',
  payProduct: (title, description, city, area, wallet, price) => `${title}
Описание: ${description}
Город и район: ${city} (${area})

◼️ Инструкция по оплате товара.
Пополните кошелек ${wallet} 
одним платежом на сумму ${price} грн или больше (без учета комиссии)

➖ПОСЛЕ ПОПОЛНЕНИЯ КОШЕЛЬКА ПОДОЖДИТЕ 1-2 МИН И НАЖМИТЕ 'ПРОВЕРИТЬ ОПЛАТУ'`,
  orderData: (title, response) => `Данные вашего заказа (${title}):\n\n${String(response).trim()}`,
  succesfulPayment: '✔ Благодарим за покупку!\nДля продолжения работы с ботом введите - /start',
  promocodeUsed: (increaseValue: number) => `✅Промокод применён! На ваш баланс поступило ${increaseValue} грн.`,
  rejectRequest: '⚠ В ближайшее полчаса мы не принимаем заказы, пожалуйста, попробуйте позже.'
}
