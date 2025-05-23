

const pool = require('../config/db.js');
const { createHash } = require('../utilities/bcryption.js');
const { jwt, refreshToken } = require('../utilities/jwt.js');




exports.createUser = async (req, res) => {

    let { user_name, email, password, role } = req.body;
    console.log(user_name, email, password, role)
    try {
        await pool.connect();
        const dbUser = await pool.query(`select * from users where email=$1`, [email]);
        console.log(dbUser.rows[0])
        if (dbUser.rows[0]) {
            return res.json("user already exist ")
        }

        const userlength = await pool.query("select * from users");
        console.log("userlength", userlength.rows.length);
        userlength.rows.length === 0 ? role = 'admin' : role;

        const hpassword = await createHash(password);
        if (role === 'employee' || role === 'freelancer' || role === 'admin') {
            const query = `insert into users(user_name, email, password , role) values($1,$2,$3,$4) returning *; `
            const values = [user_name, email, hpassword, role];
            const savedata = await pool.query(query, values);
            console.log('data save', savedata.rows[0]);
            res.status(200).json({ messege: savedata.rows[0] });
        }
        else res.status(404).json({ messege: "issue in typo" })


    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }

}
exports.login = async (req, res) => {
    const { password, email } = req.body
    try {
        if (!password || !email) {
            return res.status(400).json({ messege: "all field are required" });
        }
        const dbUser = await pool.query("select * from users where email=$1", [email])
        if (!dbUser.rows[0]) {
            return res.status(401).json("user not found");
        }

        // ************check user active behaviour *******************j
        if (dbUser.rows[0].active === false) {
            return res.status(401).json({ messege: "band u due for some restriction" })
        }
        const accessToken = jwt(email);
        const refreshTokens = refreshToken(email);
        await pool.query("update users set accessToken=$1, refreshToken=$2 where email=$3", [accessToken, refreshTokens, email])
        res.status(200).json({ accessToken, refreshTokens });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.regenrateToken = async (req, res) => {
    const { token } = req.body;
    try {
        await pool.connect()
        const dbrefreshToken = await pool.query('select * from users where refreshToken=$1', [token]);

        if (!dbrefreshToken.rows[0]) {
            return res.status(400).json("user not authenticate");
        }
        const accesstoken = jwt(dbrefreshToken.rows[0].email);

        await pool.query('update users set accessToken=$1 where refreshToken=$2', [accesstoken, token]);
        return res.status(200).json({ accesstoken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }

}
exports.usersActiveBehaviour = async (req, res) => {

    try {
        const { id } = req.body;
        console.log("id", id)
        const { user_id, role } = req.user;
        if (role === "employee" || role === "freelancer") {
            return res.status(403).json({ messege: "only admin ban or unban users" })
        }
        const isuser = await pool.query("select * from users where user_id=$1", [id])
        if (!isuser.rows[0]) {
            return res.status(200).json("USER NOT FOUND")
        }
        // add new column of active type bool 
        // await pool.query('alter table users  add column active boolean default true')
        // set initally true 
        // await pool.query("update users set active=true")
        await pool.query("update users set active=not active where user_id=$1", [id])
        return res.status(200).json("user behaviour update",)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}
exports.logout=async(req,res)=>{
    try {
        const {user_id}=req.user;
       const user= await pool.query('select email, accesstoken, refreshtoken from users where user_id=$1',[user_id]); 
       if(!user.rows[0]){
        return res.status(404).json({message:"user not found"});

       }
       const accesstoken= jwt(user.rows[0].email)
       console.log(accesstoken)
       await pool.query('update users set accesstoken =$1 , refreshtoken=$2',[accesstoken,null])
       res.json('logout successfully')

    } catch (error) {
        console.log(error)
    }
}
exports.forget=async(req,res)=>{
    try {
    const {email}=req.body;
    const user=await pool.query("select * from users where email=$1",[email]);
    if(!user.rows[0]){
        return res.status(404).json("email is not exists");
    }
    await pool.query("update users set otp=$1 , otp_time=$2 where email=$3",[ req.sentOtp.otp,req.sentOtp.time,email ])
    return  res.json({message : 'sent otp on your email successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}
exports.isUserValid = async (req, res) => {
    const email = req.email;// from otp varification
   const otp=req.otp;
   console.log(email,otp);
    const update=await pool.query('update users set  otp=null , otp_time=null  where email=$1 and otp=$2',[email,otp])
    return res.status(200).json({ messege: "delete otp success fully", update });
}

exports.newPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!password) {
            return res.status(401).json({ messege: "password required" });
        }
        if (!email) {

            return res.status(401).json({ messege: "email required" });
        }
        const alreadyOtpExists=await pool.query("select otp from users where email=$1",[email]);
        console.log(alreadyOtpExists.rows[0])
        if(alreadyOtpExists.rows[0].otp!=null){
            return res.status(200).json({message:"varify otp then genrate new password"});
        }
        const user = await pool.query("select * from users where email=$1",[email])
        if (!user.rows[0]) {
            return res.status(401).json({ messege: "email is not exist" });
        }
    
        const hashpasword = await createHash(password);
        console.log(hashpasword)
        const update=await pool.query('update users set password=$1 where email=$2',[hashpasword,email]);
        res.status(200).json({ messege: "update password successful", update });

    } catch (error) {
        res.status(500).json({ messege: "newPassowrd controller error : ", error })
    }

}
exports.getallContractData = async (req, res) => {
    try {
        const { role } = req.user;
        if (role != "admin") {
            return res.status(403).json({ message: "only admin watch view system" });
        }
        const allContractData = await pool.query("select * from contracts inner join milestone on contracts.contracts_id=milestone.contracts_id");
        if (!allContractData.rows) {
            return res.status(200).json({ message: "not have any contract between employee and freelancer" })
        }
        return res.status(200).json({ allContractData: allContractData.rows })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
exports.getAllemployees = async (req, res) => {
    try {
        const {role}=req.user
        if (role != 'admin') {
            return res.status(403).json({ message: "only admin see all users" })
        }
        const employeeData = await pool.query('select user_name ,role ,active ,companyname , description from users inner join employee_profile on employee_profile.employprofileid=users.user_id')

        if (!employeeData.rows) {
           return res.status(200).json({ message: "employee list empty" })
        }
        return res.status(200).json({ employeeData: employeeData.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.getAllfreelancers = async (req, res) => {
    try {
        const { role } = req.user;
        if (role != 'admin') {
            return res.status(403).json({ message: "only admin see all users" })
        }

        const freealancerData = await pool.query("select user_name ,role ,active ,skil ,bio,experince from users inner join freelancerprofile on users.user_id= freelancer_profile_id ")
         if (!freealancerData.rows) {
            res.status(200).json({ message: "freelancer list empty" })
        }
        res.status(200).json({freealancerData:freealancerData.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}