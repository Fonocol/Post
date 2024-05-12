require('dotenv').config();


const express = require('express');
const expressLayout = require("express-ejs-layouts");
const methodoverride = require('method-override');
const cookieparser = require('cookie-parser');
const mongoosestore = require('connect-mongo');
const session = require('express-session');


const connectDB = require("./server/config/db");
const { isActiveRoute } = require('./server/helpers/routeHelpers')

const app = express();
const PORT = 5000 || process.env.PORT;

//connect DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
app.use(methodoverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoosestore.create({ 
        mongoUrl: process.env.MONGOBD_URL 
    })
    //cookie: {maxAge: new Date (Date.now()+(3600000))}
}));

app.use(express.static('public'));

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})