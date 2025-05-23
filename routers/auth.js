
const express=require('express');
const app=express();
const validation=require("../middelwares/joiValidation")
const {nodemailer}=require('../middelwares/nodemailer')
const{OtpVerification} =require("../middelwares/otpvarification")
const controller=require('../controllers/index');
const authentication =require("../middelwares/authentication")
app.post('/',validation,controller.createUser);
app.post ('/login',controller.login);
app.post ('/accesstoken',controller.regenrateToken);
app.post('/forget',nodemailer,controller.forget);
app.patch('/otpvarify',OtpVerification,controller.isUserValid);
app.patch ('/newpassword',controller.newPassword)
app.get("/logout",authentication,controller.logout)

module.exports=app
