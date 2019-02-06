const uuid = require("uuid/v4");
const bcrypt = require("bcrypt");
const db = require("../db/index.js");

const getUsers = async (req, res) => {
    const GET = "SELECT * FROM users";
    try {
        const data = await db.query(GET);
        console.log(data.rows.count);
        return res.status(200).json({
            data: data.rows,
            count: data.rows.length
        });

    } catch (err) {
        return res.status(500).json(err);
    }
};

const getUserById = async (req, res) => {
    const user_id = req.params.id;
    const GetID = "SELECT * FROM users WHERE user_id = $1";
    try {
        const data = await db.query(GetID, [user_id]);
        res.status(200).json({
            data: data.rows,
            count: data.rows.length
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const createUser = async (req, res) => {
    const {
        name,
        password,
        email
    } = req.body;
    const CREATEsql = `INSERT INTO users(
        user_id, name, email, password
        ) VALUES($1, $2, $3, $4) returning *`;

    try {
        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);
        const data = await db.query(CREATEsql, [uuid(), name, email, hashedPw]);
        return res.status(201).json({
            result: data.rows,
            count: data.rows.length
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateUser = async (req, res) => {
    const user_id = req.params.id;
    const {
        name,
        email
    } = req.body;
    const UPDATEsql = "UPDATE users SET name = $1, email = $2 WHERE user_id = $3 returning *";
    try {
        const data = await db.query(UPDATEsql, [name, email, user_id]);
        res.status(200).json({
            data: data.rows,
            count: data.rows.length,
            updated: data.rows.length
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const deleteUser = async (req, res) => {
    const user_id = req.params.id;
    const DELETEsql = "DELETE FROM users WHERE user_id = $1 returning *";
    try {
        const data = await db.query(DELETEsql, [user_id]);
        res.status(200).json({
            data: data.rows,
            count: data.rows.length
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};






const editEmailConfirm = async (req, res) => {
    //TODO: do a get or put with a uuid as queryparam sent in the email.
    //TODO: store uuid in users table    
    //TODO: clear/invalidate uuid in x min or when sent.
    const id = req.params.id;
    console.log(id)
    const emailConfirmationQuery = `update users set email_confirm = TRUE where user_id = $1 returning *`;
    try {
        const data = await db.query(emailConfirmationQuery, [id]);
        console.log(data)
        res.status(200).json({
            message: "The account is confirmed via email.",
            data: data.rows[0]
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: true,
            message: e
        })
    }
};

const getUserLoginDirections = async (req, res) => {

    res.status(200).json({
        message: 'login page'
    })
};

//Works
//TODO: Add text sanitization;
//TODO: Add proper status codes.
const checkUserCredentials = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const checkPasswordQuery = `select password from users where email = $1`;
    try {
        const resultSet = await db.query(checkPasswordQuery, [email]);
        if (!resultSet.rows[0]) {
            return res.json({
                message: "User doesn't exist."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, resultSet.rows[0].password);
        if (!isPasswordValid) {
            return res.json({
                message: "Invalid Credentials."
            });
        }
        res.status(200).json({
            message: "User present.  Credentials valid.",
            data: resultSet.rows[0]
        })
    } catch (e) {
        console.log(`Mistakes have been made. ${e}`);
        res.status(500).json({
            error: true,
            message: e
        })
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    editEmailConfirm,
    deleteUser,
    getUserLoginDirections,
    checkUserCredentials
};