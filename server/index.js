const path = require('path')
const express = require('express')

const { PORT } = require('../config.server.json')

const app = express()

app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxAge: '30d'
  })
)

const test = require('./cloud-functions/test/').main

app.get('/api/test', (req, res, next) => {
  test(req.query).then(res.json.bind(res)).catch((error) => {
    console.error(error)
    next(error)
  })
})

app.listen(PORT, () => {
  console.log(`开发服务器启动成功：http://127.0.0.1:${PORT}`)
})
