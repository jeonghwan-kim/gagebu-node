const path = require('path')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.render('home', {title: '홈'})
})

app.get('/login', (req, res) => {
  res.render('login', {title: '로그인'})
})

app.post('/login', (req, res) => {
  res.send('login api')
})

app.get('/logout', (req, res) => {
  res.send('logout')
})

app.get('/expenses', (req, res) => {
  res.render('home', {title: '지출목록'})
})

app.get('/expenses/add', (req, res) => {
  res.render('home', {
    title: '지출 추가'
  })
})

app.post('/expenses/add', (req, res) => {
  res.send('지출 추가 api')
})

app.get('/expenses/:id/edit', (req, res) => {
  res.render('home', {
    title: '지출 수정'
  })
})

app.post('/expenses/:id/edit', (req, res) => {
  res.send('지출 수정 api:' + req.params.id)
})

app.post('/expenses/:id/delete', (req, res) => {
  res.send('지출 삭제 api:' + req.params.id)
})

app.use('*', (req, res) => {
  res.status(404).send('Not Found')
})

module.exports = app
