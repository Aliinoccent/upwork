exports.employProfile=`
create table if not exists employee_profile(
employProfileId int primary key references users(user_id) on delete cascade,
companyname varchar(255),
description varchar(255)
)
`