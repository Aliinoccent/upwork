const express=require("express")
const app=express();
const router=require('./routers/index')
const pool=require('./config/db');
const allTables =require('./models/index')
allTables();
app.use(express.json())
app.use('/',router)
app.listen(3000)
