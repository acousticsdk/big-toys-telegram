import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UsersSchema } from './models/users'
import { PlacesSchema } from './models/places'
import { ProductsSchema } from './models/products'
import { HistorySchema } from './models/history'
import { PromocodesSchema } from './models/promocodes'
import { SettingsSchema } from './models/settings'

dotenv.config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const usersModel = mongoose.model('Users', UsersSchema, 'users')
const placesModel = mongoose.model('Places', PlacesSchema, 'places')
const productsModel = mongoose.model('Products', ProductsSchema, 'products')
const historyModel = mongoose.model('History', HistorySchema, 'history')
const promocodeModel = mongoose.model('Promocde', PromocodesSchema, 'promocode')
const settingsModel = mongoose.model('Settings', SettingsSchema, 'settings')

export { usersModel, placesModel, productsModel, historyModel, promocodeModel, settingsModel }