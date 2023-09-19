const express = require('express');
const orders = require('./orders');
const { errorFormatter } = require('./../utils/hellpers');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Stubs || in real development we will not be using '*'
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})
app.use('/orders', orders);

// 404
app.use((req, res, next) => errorFormatter(res))


module.exports = app;
