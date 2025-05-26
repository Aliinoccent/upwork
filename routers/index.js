const express =require('express');
const user=require('./users')
const jobs=require('./jobs');
const message=require('./messages')
const auth= require('./auth')
const profile=require("./profile")
const app= express();

app.use('/users',user)
app.use('/auth',auth)
app.use('/job',jobs);
app.use("/messages",message);
app.use('/',profile);



module.exports=app