const express=require('express');
const app=express();
const controller=require('../controllers/index');
const authentication =require("../middelwares/authentication")
app.post('/',controller.createUser);
app.post ('/login',controller.login);
app.post ('/accesstoken',controller.regenrateToken);
app.post ('/profile',authentication,controller.profileCreate);
app.patch('/behaviour',authentication,controller.usersActiveBehaviour)

module.exports=app