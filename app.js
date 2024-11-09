const express = require('express');



// Import routes
const ownerRouter = require('./routes/owner-router');
const usersRouter = require('./routes/users-router');
const productsRouter = require('./routes/porducts-router');
const db = require("./config/mongoose-connection"); 

const app = express();



// Routes
app.use('/users', usersRouter);
app.use('/owner', ownerRouter);
app.use('/product', productsRouter);





app.listen(3000);

module.exports = app;
