const uuid = require("uuid/v4");
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
            data: data.rows
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
        ) VALUES($1, $2, $3, crypt($4, gen_salt('bf')))`;

    try {
        const data = await db.query(CREATEsql, [uuid(), name, email, password]);
        console.log(data);
        return res.status(201).json({
            result: data
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
    const UPDATEsql = "UPDATE users SET name = $1, email = $2 WHERE user_id = $3";
    try {
        const data = await db.query(UPDATEsql, [name, email, user_id]);
        res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const deleteUser = async (req, res) => {
    const user_id = req.params.id;
    const DELETEsql = "DELETE FROM users WHERE user_id = $1";
    try {
        const data = await db.query(DELETEsql, [user_id]);
        res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};