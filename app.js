const express = require('express')
const app = express()
const router = require('./routes')
const exphbs = require('express-handlebars').engine
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

//heroku 錯誤代碼 H20 新增IP
const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')



app.engine('hbs', exphbs({
  defaultLayout: 'main', extname: '.hbs', helpers: {
    selected: function (a, b) {
      if (Number(a) === Number(b)) {
        return 'selected'
      } else {
        return ''
      }
    }
  }
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, LOCAL_ADDRESS, () => {
  console.log(`This sever is running on http://localhost:${PORT
}.`)
})

