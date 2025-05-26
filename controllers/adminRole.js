
const redis=require('ioredis')

const client=new redis();

exports.getallContractData = async (req, res) => {
    try {
        const { role } = req.user;
        if (role != "admin") {
            return res.status(403).json({ message: "only admin watch view system" });
        }
        const data=await client.get('data');
        const json_data=JSON.parse(data);
        if(json_data){
            return res.status(200).json(json_data);
        }
        
        const allContractData = await pool.query("select * from contracts inner join milestone on contracts.contracts_id=milestone.contracts_id");
        if (!allContractData.rows) {
            return res.status(200).json({ message: "not have any contract between employee and freelancer" })
        }
       const string_allContract= JSON.stringify(allContractData.rows);
        client.set('data',string_allContract);
        return res.status(200).json({ allContractData: allContractData.rows });
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
        const employeedataredis=await client.get('employeeData');
        const employeeParseData=JSON.parse(employeedataredis);
        if(employeeParseData){
            console.log('this data from redis')
            return res.status(200).json({ employeeData: employeeParseData })
        }
        client.set('employeeData',JSON.stringify(employeeData.rows))
        console.log('this from backend data');
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