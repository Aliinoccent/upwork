const pool = require('../config/db.js');
exports.profileCreate = async (req, res) => {
    pool.connect();
    const { skil, bio, experince, companyName, description } = req.body;
    try {


        const { user_id, role } = req.user;
        const file = req.file
        console.log(user_id ,role);
        // const freelancerUser = await pool.query("select * from freelancerProfile where user_id=$1", [user_id]);
        // const alreadyfreelancerUser = freelancerUser.rows[0];

        // const employeeUser = await pool.query("select * from employProfile where user_id=$1", [user_id]);
        // const alreadyemployeeuser = employeeUser.rows[0];
        // if (alreadyemployeeuser || alreadyfreelancerUser) {
        //     return res.status(403).json({ messege: 'user create profile One time' })
        // }
        if (role === 'freelancer') {
            const isexistsUser = await pool.query('select * from freelancerProfile where freelancer_profile_id=$1', [user_id]);
            if (isexistsUser.rows[0]) {
                return res.status(400).json({ message: "freelancer already created profile" });
            }
            await pool.query('insert into freelancerProfile(skil,bio,experince,freelancer_profile_id,image) values($1,$2,$3,$4,$5)', [skil, bio, experince, user_id, file.path])
            return res.status(200).json({ messege: "create profile" });;
        }
        if (role === 'employee') {
            
              const isexistsUser = await pool.query('select * from employee_profile where employProfileId=$1', [user_id]);
            if (isexistsUser.rows[0]) {
                return res.status(400).json({ message: "employee already created profile" });
            }
            await pool.query('insert into employee_profile(companyname,description,employProfileId) values($1,$2,$3)', [companyName, description, user_id])
            return res.status(200).json({ messege: "create profile" });;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}
exports.profileUpdate=async(req,res)=>{
    const{skil, bio, experince,companyName, description,id}=req.body;
    try {
        const {role,user_id}=req.user;
        if(role==='freelancer'){
            if(user_id===id){

                pool.query("update table freelancerProfile set skil=$1,bio=$2",[skil,bio])
            }
            return res.json("not ok")
        }
        
    } 
    catch (error) {
        res.json("not okk")
    }
}






