
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const nodemailer = require('nodemailer');
const pool = require('../config/db'); 
require('dotenv').config();

const connection = new IORedis({ maxRetriesPerRequest: null });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER,
    pass: process.env.PASSWORD_EMAIL
  }
});

const workerContract = new Worker(
  'contractNotification',
  async contracts => {

    const object = contracts.data;
    
    const freelancers = await pool.query("select * from contracts join employee_job on employee_job.job_id=contracts.job_id where contracts.freelancer_profile_id=$1 and contracts.employProfileId=$2", [object.freelancer_id,object.user_id]);
    console.log(freelancers.rows[0]);
     const   contract=freelancers.rows[0];
     const email=await  pool.query('select email  from users where user_id=$1',[object.freelancer_id])
     console.log(email.rows[0])
      await transporter.sendMail({
  from: process.env.SENDER,
  to: 'abdulrehman.cs.123@gmail.com',
  subject: "🎉 Congrats! You've been awarded a new contract!",
  text: `
Hi Freelancer,

🎉 You’ve been selected for a new job opportunity!

📄 Job Title: ${contract.title}
💼 Description: ${contract.description}
💰 Budget: $${contract.budget}
🛠️ Required Skills: ${contract.skills_required}
📅 Deadline: ${contract.deadline} day(s)

Please log in to your profile to view more details and start working on this project.

Best of luck!
The Team
`
});
      console.log(`Email sent to ${email}`);
    
  },

  { connection }
);


module.exports = workerContract;
