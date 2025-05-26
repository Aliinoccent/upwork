
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

const worker = new Worker(
  'job_notification',
  async job => {
    const jobData = job.data;
    const freelancers = await pool.query("SELECT email FROM users WHERE role=$1", ['freelancer']);
    const emailArray = freelancers.rows.map(row => row.email);
    console.log(emailArray);

    for (const email of emailArray) {
      await transporter.sendMail({
        from: process.env.SENDER,
        to: email,
        subject: "🎉 New Job Opportunity!",
        text: `Hi Freelancer!\n\nA new job is available:\nTitle: ${jobData.title}\n budget: ${jobData.budget}\deadline: ${jobData.deadline}\n description: ${jobData.description}`
      });
      console.log(`Email sent to ${email}`);
    }
    
  },
    
  { connection }
);
worker.on('completed',(job)=>{
    console.log('complete job',job.data);
  }),

module.exports = worker;
