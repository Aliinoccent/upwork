const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const connection= new IORedis();
const queue=new Queue("job_notification",{connection});

exports.jobsubmit=async(data)=>{
    
    await queue.add("jobPublish",data)


}