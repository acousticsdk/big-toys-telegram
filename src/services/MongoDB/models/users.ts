import { Schema } from 'mongoose'

const UsersSchema: Schema = new Schema({
  userId: Number,
  username: String,
  registrationDate: String,
  countOfPurchases: Number,
  bonusBalance: Number,
  referralFriends: Array,
  inviterId: { type: Number, default: null  },
})

export { UsersSchema }