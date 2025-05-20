exports.employeeJob=`
create table if not exists employee_job(
    job_id serial not null primary key,
    title varchar(255),
    description varchar(255),
    budget int,
    skills_required varchar(255),
    deadline int,
    user_id int references users(user_id) on delete cascade
   
)`