const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken')

const app = express()

const secret = require('./config/secret')

// Routers
const ideasRouter = require('./routes/ideasRouter')
const usersRouter = require('./routes/usersRouter')


mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/myDB", {useMongoClient: true})
    .then(() => {console.log("MongoDB Connected...")})
    .catch(err => console.log(err))


// Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


// top lvl middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'))
app.use(cookieParser(secret.cookieParseSecret))   // to read jwt token in cookie
app.use(session({    // used to store flash messages
    secret: secret.cookieParseSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*10} // 10 min
}))
app.use(function(req, res, next) {               // on every req if there is token in cookie retrieve user data from jwt   
    if (req.signedCookies && req.signedCookies.token) {
        req.user = jwt.verify(req.signedCookies.token, secret.jwtSecret)
        req.isAuthenticated = true
    }
    next()
})
app.use(flash())

// Global Variables for the views
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null
    next()
})


// Routing

// home page
app.get("/", (req, res) => {
    const title = 'Welcome'
    res.render("index", {
        title: title
    })
})

// about page
app.get("/about", (req, res) => {
    res.render("about")
})

// ideas routing
app.use('/ideas', ideasRouter)


//  User Routes
app.use('/users', usersRouter)



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`vidjot is running on http://localhost:${PORT}`)
})
