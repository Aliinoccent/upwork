const pool = require('../config/db.js');
exports.profileCreate = async (req, res) => {
    pool.connect();
    const { skil, bio, experince, companyName, description } = req.body;
    try {


        const { user_id, role } = req.user;
        // const freelancerUser = await pool.query("select * from freelancerProfile where user_id=$1", [user_id]);
        // const alreadyfreelancerUser = freelancerUser.rows[0];

        // const employeeUser = await pool.query("select * from employProfile where user_id=$1", [user_id]);
        // const alreadyemployeeuser = employeeUser.rows[0];
        // if (alreadyemployeeuser || alreadyfreelancerUser) {
        //     return res.status(403).json({ messege: 'user create profile One time' })
        // }
        if (role === 'freelancer') {
        
            await pool.query('insert into freelancerProfile(skil,bio,experince,freelancer_profile_id) values($1,$2,$3,$4)', [skil, bio, experince, user_id])
           return res.status(200).json({ messege: "create profile" });;
        }
        if (role === 'employee') {
            console.log(companyName, description, user_id)
            await pool.query('insert into employee_profile(companyname,description,employProfileId) values($1,$2,$3)', [companyName, description, user_id])
           return res.status(200).json({ messege: "create profile" });;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}







