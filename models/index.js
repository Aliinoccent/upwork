const pool = require('./../config/db');
const {userTable} = require('./user');
const {freelancerProfile} = require('./freelancerProfile');
const {employProfile} = require('./employProfile')
const {employeeJob}=require('./employJob')
const {applicent}=require('./applicent')
const {contracts} =require("./contracts")
const {milestone}=require('./milestone')
const allTables = async () => {

    try {
        await pool.connect();
        await pool.query(userTable)
        console.log('userCreated');
        

        await pool.query(freelancerProfile)
            console.log('freelancerProfile table')

        await pool.query(employProfile)
            console.log('employProfile table')
        
        await pool.query(employeeJob)
            console.log("employ_job_table");

        await pool.query(applicent);
            console.log("applicent table");
        
        await pool.query(contracts);
            console.log("contracts table");
        
        await pool.query(milestone);
            console.log('milestone table');
    }
    catch (error) {
        console.log('catch error', error)
    }

}
module.exports = allTables;


