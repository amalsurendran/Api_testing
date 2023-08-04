const express = require('express');

const user_route = express();

const session = require("express-session");

const config = require("../config/config");


user_route.use(session({
    secret: config.sessionSecrets,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 360000
    }
}));


const auth = require("../middleware/auth");

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

// session destroy

user_route.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});





const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({
    extended: true
}));

const multer = require("multer");
const path = require("path");

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({
    storage: storage
});

const user_Controller = require("../controllers/userController");

user_route.get('/register', auth.isLogout, user_Controller.loadRegister);

user_route.post('/register', upload.single('image'), user_Controller.insertUser);

user_route.get('/verify', user_Controller.verifyMail);

user_route.get('/', auth.isLogout, user_Controller.loginLoad);
user_route.get('/login', auth.isLogout, user_Controller.loginLoad);

user_route.post('/login', user_Controller.verifyLogin);

user_route.get('/home', auth.isLogin, user_Controller.loadHome);

user_route.get('/logout', auth.isLogin, user_Controller.userLogout);

user_route.get('/forget', auth.isLogout, user_Controller.forgetLoad);

user_route.post('/forget', user_Controller.forgetVerify);

user_route.get('/forget-password', auth.isLogout, user_Controller.forgetPasswordLoad);

user_route.post('/forget-password', user_Controller.resetPassword);

user_route.get('/Verification', user_Controller.verificationLoad);

user_route.post('/verification', user_Controller.sendVerificationLink);

user_route.get('/edit', auth.isLogin, user_Controller.editLoad);

user_route.post('/edit', upload.single('image'), user_Controller.updateProfile);

module.exports = user_route;