exports.freelancerProfile=`
create table if not exists freelancerProfile(
freelancer_profile_id int primary key references users(user_id) on delete cascade,
skil varchar(50),
bio varchar(200),
experince DECIMAL(4,2)
)
`