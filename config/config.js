const sessionSecrets = "thesessionsecret";

const connectDb = () => {
    const mongoose = require("mongoose");
    mongoose.set('strictQuery',false);
    mongoose.connect("mongodb+srv://amalsurendran270:mongodb1234@lensfocus.4fugcsq.mongodb.net/?retryWrites=true&w=majority");
}





module.exports = {
    sessionSecrets,
    connectDb
}