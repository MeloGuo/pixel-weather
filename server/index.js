const path = require('path')
const express = require('express')

const { PORT } = require('../config.server.json')

const app = express()

const callFunction = (callback, req, res, next) => {
  callback(req.query).then(res.json.bind(res)).catch((error) => {
    console.error(error)
    next(error)
  })
}

app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxAge: '30d'
  })
)

const test = require('./cloud-functions/test/').main

app.get('/api/test', (req, res, next) => {
  callFunction(test, req, res, next)
})

const heWeather = require('./cloud-functions/he-weather/').main

app.get('/api/he-weather', (req, res, next) => {
  callFunction(heWeather, req, res, next)
})

const heAir = require('./cloud-functions/he-air').main

app.get('/api/he-air', (req, res, next) => {
  callFunction(heAir, req, res, next)
})

app.listen(PORT, () => {
  console.log(`开发服务器启动成功：http://127.0.0.1:${PORT}`)
})
