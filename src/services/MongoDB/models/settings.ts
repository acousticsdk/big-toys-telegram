import { Schema } from 'mongoose'

const SettingsSchema: Schema = new Schema({
  key: String,
  value: String
})

export { SettingsSchema }