const express =require('express');
const user=require('./users')
const jobs=require('./jobs');
const authentication = require('../middelwares/authentication');
const message=require('./messages')
const auth= require('./auth')
const app= express();

app.use('/users',user)
app.use('/auth',auth)
app.use('/job',jobs);
app.use("/messages",message);



module.exports=app