const express =require('express');
const app= express();
const controller=require("../controllers/index")
const upload = require('../multer/multer');
const authentication=require('../middelwares/authentication')
app.post ('/profile',authentication,upload.single('file'),controller.profileCreate);

module.exports=app;