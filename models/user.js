
 
exports.userTable=`
CREATE TABLE IF NOT EXISTS users(
    user_Id serial not null primary key,
    user_name  varchar(20),
    email varchar(100) unique not null,
    password varchar(255),
    role varchar(30),
    refreshtoken varchar(255),
    accesstoken varchar(255),
    active boolean,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`