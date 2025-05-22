const express=require('express');
const app=express();
    const{OtpVerification} =require("../middelwares/otpvarification")
const controller=require('../controllers/index');
const authentication =require("../middelwares/authentication")
const {nodemailer}=require('../middelwares/nodemailer')
const validation=require("../middelwares/joiValidation")
app.post('/',validation,controller.createUser);
app.post ('/login',controller.login);
app.post ('/accesstoken',controller.regenrateToken);
app.post ('/profile',authentication,controller.profileCreate);
app.patch('/behaviour',authentication,controller.usersActiveBehaviour)
app.get("/logout",authentication,controller.logout)
app.get('/allContractData',authentication,controller.getallContractData)
app.get("/allemployee",authentication,controller.getAllemployees)
app.get("/allfreelancer",authentication,controller.getAllfreelancers)
app.post('/forget',nodemailer,controller.forget);
app.patch('/otpvarify',OtpVerification,controller.isUserValid);
app.patch ('/newpassword',controller.newPassword)
module.exports=app