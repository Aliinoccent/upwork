
// const IORedis = require('ioredis');
// const eventemitter=require("events")
// const { Worker } = require('bullmq');
// const connection = new IORedis({
//   host: '127.0.0.1',
//   port: 6379,
//   maxRetriesPerRequest: null, // ✅ This is required
// });
// const {nodemailer}=require("../middelwares/nodemailer_job_Notification")

// const emmiter=new eventemitter()
// nodemailer();
// const worker = new Worker(
//   'job_notification',
//   async job => {
//     console.log(job.data,"redis data");
//     emmiter.emit('job',job.data)
    
//   },
//   { connection }
// );






// module.exports={worker}