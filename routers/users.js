const express=require('express');
const app=express();
const controller=require('../controllers/index');
const authentication =require("../middelwares/authentication")
app.patch('/behaviour',authentication,controller.usersActiveBehaviour)
app.get('/allContractData',authentication,controller.getallContractData)
app.get("/allemployee",authentication,controller.getAllemployees)
app.get("/allfreelancer",authentication,controller.getAllfreelancers)

module.exports=app