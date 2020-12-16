const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const flash = require('express-flash');
const csrf = require('csurf');
const { connectDB } = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const store = new MongoDBStore({
    url: process.env.MONGODB_CONN_STR
});
app.use(
    session({
        store,
        secret: process.env.MONGODB_STORE_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 3600 * 1000 * 3,
        },
    })
);

app.use(csrf());

app.use(flash());

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.admin = req.session.admin;
    res.locals.teacher = req.session.teacher;
    res.locals.student = req.session.student;
    res.locals.csrfToken = req.csrfToken();
    // res.locals.messages = req.session.flash;
    next();
});

// Routes
app.use('/students', require('./routes/students'));
app.use('/teachers', require('./routes/teahcers'));
app.use('/admins', require('./routes/admins'));
app.get('/register', (req, res) => {
    return res.render('register.ejs', { path: '/register' });
});

app.get('/login', (req, res) => {
    return res.render('login.ejs', { path: '/login' });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});

app.get('/', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admins/dashboard');
    } else if (req.session.student) {
        return res.redirect('/students/dashboard');
    } else if (req.session.teacher) {
        return res.redirect('/teachers/dashboard');
    } else {
        return res.render('index.ejs', { path: '/' });
    }
});

const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () =>
    console.log(`App running in ${NODE_ENV} mode on port ${PORT}`)
);
