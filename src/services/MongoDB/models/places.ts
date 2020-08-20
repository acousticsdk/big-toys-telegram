import { Schema } from 'mongoose'

const PlacesSchema: Schema = new Schema({
  city: String,
  areas: Array,
})

export { PlacesSchema }