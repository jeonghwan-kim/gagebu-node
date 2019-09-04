const path = require('path')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const app = express()
const debug = require('debug')('gagebu')

const users = [{id: 1, username: 'alice', password: 'qwer1234'}]


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id)
  done(null, user)
})

passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(user => user.username === username)
  if (!user) {
    return done(null, false, {
      message: `사용자 이름('${username}')을 찾을수 없습니다.`
    })
  }

  if (user.password !== password) {
    return done(null, false, {
      message: '비밀번호가 맞지 않습니다.'
    })
  }

  done(null, user)
}))

const isAuthenticated = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.sendStatus(401)
}


app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(session({
  secret: 'cats',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/', (req, res) => {
  res.render('home', {title: '홈'})
})

app.get('/login', (req, res) => {
  res.render('login', {
    title: '로그인', 
    error: req.flash('error')
  })
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      req.flash('error', info.message)
      return res.redirect('/login')
    }

    req.logIn(user, (err) => {
      if (err) return next(err)
      res.json({ user })
    })
  })(req, res, next)
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/expenses', isAuthenticated, (req, res) => {
  res.render('home', {title: '지출목록'})
})

app.get('/expenses/add', isAuthenticated, (req, res) => {
  res.render('home', {
    title: '지출 추가'
  })
})

app.post('/expenses/add', isAuthenticated, (req, res) => {
  res.send('지출 추가 api')
})

app.get('/expenses/:id/edit', isAuthenticated, (req, res) => {
  res.render('home', {
    title: '지출 수정'
  })
})

app.post('/expenses/:id/edit', isAuthenticated, (req, res) => {
  res.send('지출 수정 api:' + req.params.id)
})

app.post('/expenses/:id/delete', isAuthenticated, (req, res) => {
  res.send('지출 삭제 api:' + req.params.id)
})

app.use('*', (req, res) => {
  res.status(404).send('Not Found')
})

module.exports = app
