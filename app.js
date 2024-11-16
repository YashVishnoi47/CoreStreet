const express = require('express');
const path = require('path');


const app = express();


// ejs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Import routes
const ownerRouter = require('./routes/owner-router');
const usersRouter = require('./routes/users-router');
const productsRouter = require('./routes/porducts-router');
var indexRouter = require('./routes/index');
const db = require("./config/mongoose-connection"); 


// Routes
app.use('/users', usersRouter);
app.use('/owner', ownerRouter);
app.use('/product', productsRouter);
app.use('/', indexRouter);



app.listen(3000);

module.exports = app;
