const jwt=require('jsonwebtoken')
const pool= require ('../config/db')
require('dotenv').config();

const authentication=async(req,res,next)=>{
    pool.connect();
  try {
    
const auth= req.headers['authorization'];
const token = auth &&  auth.split(' ')[1];
console.log("token",token)
if(!token){
  return  res.status(403).json({messege:"user unauthrized"});
}
const isuserhasToken=await pool.query('select * from users where accesstoken=$1',[token]);
if(!isuserhasToken.rows[0]){
res.status(403).json({messege:"invalid token"});
}

const verifyUser=  jwt.verify(token,process.env.ACCESS_SECERAT_KEY);
if(!verifyUser){
 return res.status(400).json("token expire");
}
 const Userauth=await pool.query('select user_id , user_name , role , created_at from users where email=$1',[verifyUser.email]);
 req.user=Userauth.rows[0];
 console.log(Userauth.rows[0],'this is auth user now')
 next();
  } catch (error) {
    console.log(error)
    res.status(500).json({error});
  }

}
module.exports=authentication;