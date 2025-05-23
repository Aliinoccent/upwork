const express=require('express');
const app=express();
const controller=require('../controllers/index');
const authentication =require("../middelwares/authentication")
const upload = require('../multer/multer');

app.post ('/profile',authentication,upload.single('file'),controller.profileCreate);
app.patch('/behaviour',authentication,controller.usersActiveBehaviour)
app.get('/allContractData',authentication,controller.getallContractData)
app.get("/allemployee",authentication,controller.getAllemployees)
app.get("/allfreelancer",authentication,controller.getAllfreelancers)

module.exports=app