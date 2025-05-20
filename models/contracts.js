exports.contracts=`
CREATE TABLE IF NOT EXISTS contracts(
contracts_id serial not null primary key,
employProfileId int references employProfile(employProfileId) on delete cascade ,
job_id int references employee_Job(job_id) on delete cascade,
freelancer_profile_id int references freelancerProfile(freelancer_profile_id) on delete cascade

)` 