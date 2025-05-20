exports.applicent=`
create table if not exists applicent(
applicent_id serial not null primary key,
cover_letter varchar(255),
bid_amount int,
duration_estimate int,
user_id int references users(user_id) on delete cascade,
job_id int references employee_job(job_id) on delete cascade
)` 