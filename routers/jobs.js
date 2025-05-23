const express=require('express');
const authentication =require("../middelwares/authentication")
const app=express();
const controller=require('../controllers/index')
const Joivalidation=require('../middelwares/joivalidationJob')
app.post('/',authentication,Joivalidation,controller.createEmployeeJob)
app.post ('/applied',authentication,controller.applicant);
app.get('/jobDetails',authentication,controller.jobDetails)
app.get('/applicent',authentication,controller.employeSeeApplicents);
app.post ('/contract',authentication,controller.contracts)
app.post("/milestone",authentication,controller.milestone)
app.get("/alljobs",authentication,controller.allJobs);
app.patch('/milestoneStatus',authentication,controller.milestoneStatusUpdate);
app.get('/contractfound',authentication,controller.getAllContracts)
module.exports=app