const pool =require("../config/db");
exports.OtpVerification = async (req, res, next) => {
    
    const date = new Date();
    const minuts = date.getMinutes()  ;
    const {email,otp}=req.body;
    try{
     await pool.connect();
     const userData=await pool.query('select otp , otp_time , email from users where email=$1 ',[email]);
      const oldOtpTime= userData.rows[0].otp_time;
      
      console.log("old time",oldOtpTime, "currentTime",minuts)
      
      const diffTime = minuts - oldOtpTime;
      console.log("diff time",diffTime);
      let bool=false;
      let otpBool=false;
      if (minuts >= oldOtpTime && diffTime<=2){
        
        if (userData.rows[0].otp===otp){  // otp match 
          
          bool=true;
        }
        otpBool=true
      }
      if(bool){
          req.email=userData.rows[0].email;
          req.otp=userData.rows[0].otp;
          next();
      }
      else if (bool==false && otpBool==true){
         return res.status(400).json({messege:"otp is invalid "});
      }
      else{
        return res.status(400).json({message:"opt exapire"});
      }
  

    }catch(error){
      console.log(error)
      res.json(error)
    }
   
}
