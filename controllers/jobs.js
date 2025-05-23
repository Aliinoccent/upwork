const pool = require('../config/db');
const {jobsubmit}=require("../bullMq/production")
const {worker}=require('../middelwares/nodemailer_job_Notification')
exports.createEmployeeJob = async (req, res) => {

    try {
        pool.connect()
        const { title, description, budget, skills_required, deadline } = req.body;
        if (!title || !description || !budget || !skills_required || !deadline) {
            return res.status(403).json({ messege: "all field are required" });
        }
        const { user_id, role } = req.user;
        if (role === 'freelancer') {
            return res.status(403).json("only employee create job");
        }
        jobsubmit({title, description, budget, skills_required, deadline, user_id})
        await pool.query("insert into employee_job(title,description,budget,skills_required ,deadline,user_id) values($1,$2,$3,$4,$5,$6)", [title, description, budget, skills_required, deadline, user_id])
       return res.json({title, description, budget, skills_required, deadline, user_id,message:"create job successfully"});


    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}
exports.applicant = async (req, res) => {
    const { cover_letter, duration, bid_amount, job_id } = req.body;
    const { user_id, role } = req.user;
    console.log(user_id)
    try {
        if (role === 'employee') {
            return res.status(403).json("only freelancer can apply on job");
        }
        const isjob = await pool.query("select * from employee_job where job_id=$1", [job_id]);
        const existjob = isjob.rows[0];
        if (!existjob) {
            return res.status(404).json('job is not exist');
        }
        let applicentFreelancer = await pool.query('select * from applicent where user_id=$1 and job_id=$2', [user_id, job_id]);
        console.log(applicentFreelancer.rows);
        applicentFreelancer = applicentFreelancer.rows[0]

        if (applicentFreelancer?.user_id) {  // first time when data is empty it reutn undefiend 
            return res.status(403).json(" already applied for job ");
        }
        await pool.query("insert into applicent (cover_letter,bid_amount,duration_estimate,job_id ,user_id)values($1,$2,$3,$4,$5)", [cover_letter, bid_amount, duration, job_id, user_id])
        res.json("applicent apply");
    } catch (error) {
        console.log(error)
        res.json({ error })
    }
}
exports.jobDetails = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role === 'freelancer') {
            res.status(403).json("only employee see own list");
        }
        console.log(user_id)
        const data = await pool.query("select user_name , title,job_id, description from users inner join employee_job on employee_job.user_id=users.user_id  where users.user_id=$1 ", [user_id])
        if (data.rowCount === 0) {
            res.json({ messege: "empty list" })
        }
        return res.json({ data: data.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}
exports.employeSeeApplicents = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role === 'freelancer') {
            return res.status(403).json("only employee see own list");
        }
        console.log(user_id)
        const data = await pool.query("select employee_job.title, employee_job.budget,employee_job.skills_required,applicent.user_id as freelancer , applicent.cover_letter, applicent.bid_amount from users  inner join employee_job on employee_job.user_id=users.user_id inner join applicent on applicent.job_id=employee_job.job_id where users.user_id=$1 ", [user_id])
        if (data.rowCount === 0) {
            return res.json({ messege: "empty list" })
        }
        return res.json({ data: data.rows });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.contracts = async (req, res) => {
    try {
        const { job_id, freelancer_id } = req.body;
        const { user_id, role } = req.user;
        if (role === 'freelancer') {
            return res.status(403).json("only employee make contract");
        }
        const isjob = await pool.query('select * from employee_job where user_id=$1 and job_id=$2',[user_id,job_id]);
        const isJobExists = isjob.rows[0];
        console.log(isjob.rows[0])
        if (!isJobExists) {
            res.status(404).json("this job not exests from your profile");
        }
        const isFreelancer = await pool.query('select * from applicent where user_id=$1 and job_id=$2', [freelancer_id,job_id])
        const isFreelancerExists = isFreelancer.rows[0];
        if (!isFreelancerExists) {
            return res.status(404).json("freelancer not exists in your applicents");
        }
        // *************check kerna ha ke isi employee ne job create ki****************

        const isAuthEmp = await pool.query('select * from contracts where employProfileId =$1 and job_id=$2 ', [user_id, job_id]);
        if (!isAuthEmp.rows) {
            res.status(400).json("employe not have own job");
        }
        if (isAuthEmp.rows[0]?.job_id) {
            return res.status(403).json('contract already created  by this job');
        }
        await pool.query("insert into contracts(freelancer_profile_id,job_id,employProfileId) values($1,$2,$3)", [freelancer_id, job_id, user_id])
        res.status(200).json("contract successfully created");
    } catch (error) {
        console.log({ error })
    }
}
exports.milestone = async (req, res) => {
    try {
        const users = req.body;
        const {user_id,role}=req.user
        console.log(users,role);

        // const isContractExist =await pool.query('select * from milestone inner join contracts on milestone.contracts_id= contracts.contracts_id  where contracts.contracts_id=$1',[users[0].contracts_id]);
        if(role==='freelancer'){
            return res.status(400).json({message:"only employee can create milestone"})
        }
        const isContractExist = await pool.query('select * from contracts where contracts_id=$1 and employProfileId=$2', [users[0].contracts_id,user_id]);
        if (!isContractExist.rows[0]) {
            return res.status(403).json({ messege: " contract is not exists from your account" });
        }
        const inMilestoneHasContractAlready = await pool.query("select * from milestone where contracts_id=$1", [users[0].contracts_id])
        if (inMilestoneHasContractAlready.rowCount) {
            return res.status(403).json({ messege: "milestone under working" });
        }

        users.forEach(user => {
            pool.query("insert into milestone (amount ,description, contracts_id) values ($1,$2,$3)", [user.amount, user.description, user.contracts_id])
        });

        return res.status(200).json("milestone created successfully")
    } catch (error) {
        res.status(500).json({ error });
    }
}
exports.allJobs = async (req, res) => {
    try {

        const alljobs = await pool.query('select user_name ,job_id, title from users inner join  employee_job on users.user_id=employee_job.user_id');
        if (alljobs.rowCount === 0) {
            return res.status(200).json({ message: "empty list" });
        }
        return res.status(200).json({ alljobs: alljobs.rows });
    } catch (error) {
        return res.status(500).json({ error })
    }
}
exports.milestoneStatusUpdate = async (req, res) => {
    try {
        const { milestone_id, contract_id } = req.body;
        const { role, user_id } = req.user;
        console.log("milestone value", milestone_id)
        if (role === 'freelancer') {
            const isContract = await pool.query('select * from milestone inner join contracts on milestone.contracts_id= contracts.contracts_id and milestone.milestone_id=$1 and milestone.contracts_id=$2', [milestone_id, contract_id]);
            console.log(isContract.rows, 'this is contract')
            if (isContract.rowCount === 0) {
                return res.status(403).json({ message: "contract not exists or milse stone is notexiste" });
            }
            if (isContract.rows[0].contracts_id !== contract_id) {
                return res.status(403).json({ message: "contract is not exists" });
            }

            if (isContract.rows[0]?.freelancer_profile_id !== user_id) {
                return res.status(403).json({ error: 'freelancer has not contract of any job or milestone_id is not exists' })
            }
            if (isContract.rows[0]?.status === 'inprograss') {
                return res.status(403).json({ message: 'already update status inprogress' });
            }
            const updateStatus = await pool.query('update milestone  set status =$1 where milestone_id=$2', ['inprograss', milestone_id])
            return res.json({ updateStatus })
        }
        if (role === 'employee') {
            const isContract = await pool.query('select * from milestone inner join contracts on milestone.contracts_id= contracts.contracts_id and milestone.milestone_id=$1 and milestone.contracts_id=$2', [milestone_id, contract_id]);
            console.log(isContract.rows, 'this is contract')
            if (isContract.rowCount === 0) {
                return res.status(403).json({ message: "contract not exists or milse stone is notexiste" });
            }
            if (isContract.rows[0].contracts_id !== contract_id) {
                return res.status(403).json({ message: "contract is not exists" });
            }

            if (isContract.rows[0]?.employprofileid !== user_id) {
                return res.status(403).json({ error: 'employee has not contract of any job or milestone_id is not exists' })
            }
            if (isContract.rows[0]?.status === 'compelete') {
                return res.status(200).json({ message: 'already work done' });
            }
            const updateStatus = await pool.query('update milestone  set status =$1 , payment=$2 where milestone_id=$3', ['compelete', true,milestone_id,])
            return res.json({ updateStatus })
        }
    } catch (error) {

        console.error("Error in milestoneStatusUpdate:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getAllContracts=async(req,res)=>{
    try {
        const {user_id} =req.user;
        const iscontractExists= await pool.query("select * from contracts where employProfileId=$1",[user_id]);
        if(!iscontractExists.rowCount){
            return res.status(403).json({message:"not have contract"});
        }
        return res.status(200).json({message:iscontractExists.rows[0]});
        
    }
    catch(error){
        console.log(error)
       return res.status(500).json({error});
    }
}