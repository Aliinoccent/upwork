
// const {}=require('./users');
const {profileCreate,profileUpdate}=require("./profile")
const {createEmployeeJob,applicant,jobDetails,employeSeeApplicents,contracts,milestone,allJobs,milestoneStatusUpdate,getAllContracts}=require('./jobs')
const {createUser,login,regenrateToken,usersActiveBehaviour,logout,forget,isUserValid,newPassword}=require('./auth')
const { getallContractData, getAllfreelancers,getAllemployees}=require("./adminRole.js")
const {messages,sendMessage}=require('./messages');

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
    milestoneStatusUpdate,
    getAllContracts,
    messages,
    sendMessage,
    getallContractData,
    getAllfreelancers,
    getAllemployees,
    logout,
    forget,
    isUserValid,
    newPassword,
    profileUpdate
}