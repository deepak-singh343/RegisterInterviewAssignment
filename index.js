//require express
const express = require('express');
//require cookieParser
const cookieParser = require('cookie-parser');
const app = express();
//define the port
const port = 8000;
//require express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
//require mongoose
const db = require('./config/mongoose');

//require express-session
const session = require('express-session');
//require passport
const passport = require('passport');
//require passport-local-strategy
const passportLocal = require('./config/passport-local-strategy');

//require connect-mongo
const MongoStore = require('connect-mongo')(session);

//require connect-flash
const flash = require('connect-flash');
const customWare = require('./config/middleware');


//use built-in middlewares
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('./assets'));

//make uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up view engine
app.set('view engine', 'ejs');
app.set('vews', './views');

//store session cookie in db
app.use(session({
    name: 'bootcamp',
    secret: 'deepak',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
    ,
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
    function (err) {
        console.log(err)
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


app.use(flash());
app.use(customWare.setFlash);

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server:${err}`);
    }
    console.log(`Server is running on port:${port}`);
});