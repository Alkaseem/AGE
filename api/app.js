require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.json({
        AppName: "A_G_E",
        Message: "Welcome to Ammuha General Enterprises"
    })
});

const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`App started on port ${port}`)
})