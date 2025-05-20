
const {createUser,login,regenrateToken,usersActiveBehaviour}=require('./users');
const {profileCreate}=require("./profile")
const {createEmployeeJob,applicant,jobDetails,employeSeeApplicents,contracts,milestone,allJobs,milestoneStatusUpdate}=require('./jobs')
module.exports={
    createUser,
    login,
    regenrateToken,
    profileCreate,
    createEmployeeJob,
    applicant,
    jobDetails,
    employeSeeApplicents,
    usersActiveBehaviour,
    contracts,
    milestone,
    allJobs,
    milestoneStatusUpdate
}