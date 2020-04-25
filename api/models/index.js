const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGO_URI, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("Database connected!!"))
    .catch(err => console.log(`Error: ${err}`));

module.exports.User = require('./user');
module.exports.Product = require('./product');