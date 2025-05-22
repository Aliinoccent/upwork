exports.messeges=`
create table if not exists messages(
message_id serial not null primary key,
sender_id int,
reciver_id int ,
content varchar(255),
read_status boolean default true,
contracts_id int references contracts(contracts_id) on delete cascade
)`