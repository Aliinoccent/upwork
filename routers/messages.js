const express=require('express');
const app=express();
const controller=require('../controllers/index')

app.get('/:id',controller.messages);
app.post('/:id',controller.sendMessage);
module.exports=app