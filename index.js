

const express = require("express");
const app = express();
const path = require("path")
// user route
const userRoute = require('./routes/userRoutes');
app.use('/', userRoute);

const db = require('./config/config');
db.connectDb();

// admin route
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);
//app.use(express.static(path.join(__dirname+'/public')));





app.listen(3000, function () {
    console.log("Server is running");
});