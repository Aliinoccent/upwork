require('dotenv').config();
const jwt = require('jsonwebtoken')
exports.jwt=(email)=>{
 const token =jwt.sign({email},process.env.ACCESS_SECERAT_KEY,{expiresIn:'1h'})
 return token
}
exports.refreshToken=(email)=>{
    const token=jwt.sign({email},process.env.REFRESH_SECERAT_KEY,{expiresIn:'5d'})
    return token
}