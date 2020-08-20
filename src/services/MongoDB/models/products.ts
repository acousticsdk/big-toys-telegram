import { Schema } from 'mongoose'

const ProductsSchema: Schema = new Schema({
  title: String,
  description: String,
  city: String,
  area: Array,
  price: Number,
  stock: Array,
})

export { ProductsSchema }