const express = require('express');
const admin_route = express();

const session = require("express-session");
const config = require('../config/config');

admin_route.use(session(
    { secret: config.sessionSecrets ,
      resave:false,
      saveUninitialized:false,
      cookie:{
        expires:360000
      }
    }
));




const bodyParser = require("body-parser");

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));
9
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');


//session destroy



admin_route.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});



const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

const auth = require("../middleware/adminAuth");

const admin_Controller = require("../controllers/adminController");

admin_route.get('/', auth.isLogout, admin_Controller.loadLogin);

admin_route.post('/', admin_Controller.verifyLogin);

admin_route.get('/home', auth.isLogin, admin_Controller.loadDashboard);

admin_route.get('/logout', auth.isLogin, admin_Controller.logout);

admin_route.get('/forget', auth.isLogout, admin_Controller.forgetLoad);

admin_route.post('/forget', admin_Controller.forgetVerify);

admin_route.get('/forget-password', auth.isLogout, admin_Controller.forgetPasswordLoad);

admin_route.post('/forget-password', admin_Controller.resetPassword);

admin_route.get('/dashboard', auth.isLogin, admin_Controller.adminDashboard);

admin_route.get('/new-user', auth.isLogin, admin_Controller.newUserLoad);

admin_route.post('/new-user', upload.single('image'), admin_Controller.addUser);

admin_route.get('/edit-user', auth.isLogin, admin_Controller.editUserLoad);

admin_route.post('/edit-user', auth.isLogin, admin_Controller.updateUsers);

admin_route.get('/delete-user', admin_Controller.deleteUser);



admin_route.get('*', function (req, res) {

    res.redirect('/admin');
});

module.exports = admin_route;