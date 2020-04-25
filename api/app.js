require('dotenv').config();
const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const errorHandler = require('./handlers/error');
const authRoute = require('./routes/user');
const productRoute = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}))

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);

app.get('/api', async (req, res) => {
    res.json({
        AppName: "A_G_E",
        Message: "Welcome to Ammuha General Enterprises"
    })
});

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`App started on port ${port}`)
})