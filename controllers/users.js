

const pool = require('../config/db.js');
const { createHash } = require('../utilities/bcryption.js');
const { jwt, refreshToken } = require('../utilities/jwt.js');



exports.createUser = async (req, res) => {

    let { user_name, email, password, role } = req.body;
    console.log(user_name, email, password, role)
    try {
        await pool.connect();
        if (!user_name || !email || !password || !role) {
            return res.status(400).json({ messege: 'required all filed' })
        }

        const dbUser = await pool.query(`select * from users where email=$1`, [email]);
        console.log(dbUser.rows[0])
        if (dbUser.rows[0]) {
            return res.json("user already exist ")
        }

        const userlength = await pool.query("select * from users");
        console.log("userlength", userlength.rows.length);
        userlength.rows.length === 0 ? role = 'admin' : role;

        const hpassword = await createHash(password);
        if (role === 'employee' || role === 'freelancer' || role === 'admin') {
            const query = `insert into users(user_name, email, password , role) values($1,$2,$3,$4) returning *; `
            const values = [user_name, email, hpassword, role];
            const savedata = await pool.query(query, values);
            console.log('data save', savedata.rows[0]);
            res.status(200).json({ messege: savedata.rows[0] });
        }
        else res.status(404).json({messege:"issue in typo"})


    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }

}
exports.login = async (req, res) => {
    const { password, email } = req.body
    try {
        if (!password || !email) {
            return res.status(400).json({ messege: "all field are required" });
        }
        const dbUser = await pool.query("select * from users where email=$1", [email])
        if (!dbUser.rows[0]) {
            return res.status(401).json("user not found");
        }

        // ************check user active behaviour *******************j
        if (dbUser.rows[0].active === false) {
            return res.status(401).json({ messege: "band u due for some restriction" })
        }
        const accessToken = jwt(email);
        const refreshTokens = refreshToken(email);
        await pool.query("update users set accessToken=$1, refreshToken=$2 where email=$3", [accessToken, refreshTokens, email])
        res.status(200).json({ accessToken, refreshTokens });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.regenrateToken = async (req, res) => {
    const { token } = req.body;
    try {
        await pool.connect()
        const dbrefreshToken = await pool.query('select * from users where refreshToken=$1', [token]);

        if (!dbrefreshToken.rows[0]) {
            return res.status(400).json("user not authenticate");
        }
        const accesstoken = jwt(dbrefreshToken.rows[0].email);

        await pool.query('update users set accessToken=$1 where refreshToken=$2', [accesstoken, token]);
        return res.status(200).json({ accesstoken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }

}
exports.usersActiveBehaviour = async (req, res) => {

    try {
        const { id } = req.body;
        console.log("id", id)
        const { user_id, role } = req.user;
        if (role === "employee" || role === "freelancer") {
            return res.status(403).json({ messege: "only admin ban or unban users" })
        }
        const isuser = await pool.query("select * from users where user_id=$1", [id])
        if (!isuser.rows[0]) {
            return res.status(200).json("USER NOT FOUND")
        }
        // add new column of active type bool 
        // await pool.query('alter table users  add column active boolean default true')
        // set initally true 
        // await pool.query("update users set active=true")
        await pool.query("update users set active=not active where user_id=$1", [id])
        return res.status(200).json("user behaviour update",)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}