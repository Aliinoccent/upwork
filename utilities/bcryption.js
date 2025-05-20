const bcrypt= require('bcryptjs')

exports.createHash=async(planPassword)=>{
const saltVal=10;
 const hashPassword=await bcrypt.hash(planPassword,saltVal);
 return hashPassword;
}

exports.matchPassword=async(hashPassword,plainPassword)=>{
 const istrue=await bcrypt.compare(hashPassword,plainPassword);
 return istrue
}