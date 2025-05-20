exports.milestone=`
create table if not exists milestone(
milestone_id serial not null primary key,
amount int,
status varchar(255) default 'pending',
description varchar(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
contracts_id int references contracts(contracts_id) on delete cascade)`