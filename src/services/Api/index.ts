import uuidv4 from 'uuid/v4'
import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { placesModel, productsModel, usersModel, historyModel, promocodeModel, settingsModel } from '../MongoDB'
import anthology from '../Scenario'

const app = express()

app.use(cors())
app.use(express.json()) 
dotenv.config()

app.get('/places', async (req, res) => {
  const places = await placesModel.find({})
  return await res.status(200).send(places)
})

app.post('/places', async (req, res) => {
  const { city, areas } = req.query
  await placesModel.create({ city, areas: areas.split(',') })
  return await res.status(200).send('Succesfuly created!')
})

app.delete('/places', async (req, res) => {
  const { city, areas } = req.query
  if (Array.isArray(areas)) {
    await placesModel.deleteMany({ city, areas })
  } else {
    await placesModel.deleteMany({ city, areas: areas.split(',') })
  }
  return await res.status(200).send('Successfully deleted!')
})

app.put('/places', async (req, res) => {
  const oldData = JSON.parse(req.query.old)
  const newData = JSON.parse(req.query.new)
  if (Array.isArray(oldData.areas) && !Array.isArray(newData.areas)) {
    await placesModel.updateMany({ city: oldData.city, areas: oldData.areas }, { city: newData.city, areas: newData.areas.split(',') })
  } else if (!Array.isArray(oldData.areas)) {
    await placesModel.updateMany({ city: oldData.city, areas: oldData.areas.split(',') }, { city: newData.city, areas: newData.areas.split(',') })
  } else {
    await placesModel.updateMany({ city: oldData.city, areas: oldData.areas }, { city: newData.city, areas: newData.areas })
  }
  return await res.status(200).send('Successfully updated!')
})

app.get('/products', async (req, res) => {
  const prdocuts = await productsModel.find({})
  return await res.status(200).send(prdocuts)
})

app.post('/products', async (req, res) => {
  const { title, description, city, area, price, stock } = req.query
  await productsModel.create({ title, description, city, area, price, stock: stock.split(',') })
  return await res.status(200).send('Succesfuly created!')
})

app.delete('/products', async (req, res) => {
  const { title, description, city, area, price, stock } = req.query
  if (Array.isArray(stock)) {
    await productsModel.deleteMany({ title, description, city, area, price, stock })
  } else {
    await productsModel.deleteMany({ title, description, city, area, price, stock: stock.split(',') })
  }
  return await res.status(200).send('Successfully deleted!')
})

app.put('/products', async (req, res) => {
  const oldData = JSON.parse(req.query.old)
  const newData = JSON.parse(req.query.new)
  if (Array.isArray(oldData.stock) && !Array.isArray(newData.stock)) {
    await productsModel.updateMany({ title: oldData.title, description: oldData.description, city: oldData.city, area: oldData.area, price: oldData.price, stock: oldData.stock },
      { title: newData.title, description: newData.description, city: newData.city, area: newData.area, price: newData.price, stock: newData.stock.split(',')})
  } else if (!Array.isArray(oldData.stock)) {
    await productsModel.updateMany({ title: oldData.title, description: oldData.description, city: oldData.city, area: oldData.area, price: oldData.price, stock: oldData.stock.split(',') },
      { title: newData.title, description: newData.description, city: newData.city, area: newData.area, price: newData.price, stock: newData.stock.split(',')})
  } else {
    await productsModel.updateMany({ title: oldData.title, description: oldData.description, city: oldData.city, area: oldData.area, price: oldData.price, stock: oldData.stock },
      { title: newData.title, description: newData.description, city: newData.city, area: newData.area, price: newData.price, stock: newData.stock})
  }
  return await res.status(200).send('Successfully updated!')
})

app.get('/users', async (req, res) => {
  const users = await usersModel.find({})
  return await res.status(200).send(users)
})

app.get('/history', async (req, res) => {
  const history = await historyModel.find({})
  return await res.status(200).send(history)
})

app.get('/statistics', async (req, res) => {
  let allTimePrice = 0
  const history = await historyModel.find({})
  const users = await usersModel.find({})
  const products = await productsModel.find({})
  history.forEach(record => {
    allTimePrice += record.price
  })
  return await res.status(200).send({ price: allTimePrice, usersCount: users.length, sellingCount: history.length, products })
})

app.get('/promocode', async (req, res) => {
  const promocodes = await promocodeModel.find({})
  return await res.status(200).send(promocodes)
})

app.post('/promocode', async (req, res) => {
  const { promo, increaseValue } = req.query
  await promocodeModel.create({ promo, increaseValue: Number(increaseValue) })
  return await res.status(200).send('Successfully created!')
})

app.delete('/promocode', async (req, res) => {
  const { promo, increaseValue } = req.query
  await promocodeModel.deleteMany({ promo, increaseValue: Number(increaseValue) })
  return await res.status(200).send('Successfully deleted!')
})

app.post('/mailing', async (req, res) => {
  await anthology.get('adminMakeMailing')(req.query.mailingText)
  return await res.status(200).send('Mailing successfully!')
})

app.get('/easyPayApiUrl', async (req, res) => {
  return await res.status(200).send(process.env.EASYPAY_URL)
})

let userToken;

app.post('/auth/user', async (req, res) => {
  const userEmail = req.body.email
  const userPassword = req.body.password
  console.log(userEmail, userPassword)
  userToken = uuidv4()
  return await res.status(200).send({ status: 200, data: { token: userToken } })
})

app.post('/auth/logout', async (req, res) => {
  userToken = null
  return await res.status(200).send({ status: 200 })
})

export { app }