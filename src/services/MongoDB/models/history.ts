import { Schema } from 'mongoose'

const HistorySchema: Schema = new Schema({
  buyerId: Number,
  buyerUsername: String,
  price: Number,
  date: String,
  response: String
})

export { HistorySchema }