const express =require('express');
const user=require('./users')
const jobs=require('./jobs');
const authentication = require('../middelwares/authentication');
const app= express();

app.use('/users',user)
app.use('/job',authentication,jobs);



module.exports=app