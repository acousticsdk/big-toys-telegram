import Telegraf from 'telegraf'
import dotenv from 'dotenv'
import { app } from './services/Api'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

try {
  bot.launch()
  app.listen(4615, () => {
    console.log('Express and Bot listening on port 4615!')
  })
} catch (err) {
  console.log(err)
}

export { bot }