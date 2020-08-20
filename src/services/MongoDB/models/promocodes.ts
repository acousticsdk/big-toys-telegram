import { Schema } from 'mongoose'

const PromocodesSchema: Schema = new Schema({
  promo: String,
  increaseValue: Number,
})

export { PromocodesSchema }