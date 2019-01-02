const Pool = require("pg").Pool;

const {
    PGUSER,
    PGHOST,
    PGDATABASE,
    PGPASSWORD,
    PGPORT
} = process.env;
const pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
});


// const getUsers = (req, res) => {
//     pool.query("SELECT * FROM users ORDER BY id ASC", (err, data) => {
//         if (err) {
//             return res.status(500).json(err);
//         }
//         res.status(200).json({
//             data: data.rows
//         });
//     });
// };

const getUsers = async (req, res) => {
    const GET = "SELECT * FROM users ORDER BY id ASC";
    pool.query(GET).then(data => {
        console.log(data.rows);
        return res.status(200).json({
            data: data.rows
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const GetID = "SELECT * FROM users WHERE id = $1";
    pool.query(GetID, [id]).then(data => {
        res.status(200).json({
            data: data.rows
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
};

// const createUser = (req, res) => {
//     const {
//         name,
//         email
//     } = req.body;
//     pool.query("INSERT INTO users(name, email) VALUES($1, $2)", [name, email], (err, data) => {
//         if (err) {
//             return res.status(500).json(err);
//         }
//         res.status(201).json(data);
//     });
// };

const createUser = async (req, res) => {
    const {
        name,
        email
    } = req.body;
    const CREATEsql = "INSERT INTO users(name, email) VALUES($1, $2)"
    pool.query(CREATEsql, [name, email]).then(data => {
        return res.status(201).json(data);
    }).catch(err => {
        return res.status(500).json(err);
    });
};

// const updateUser = (req, res) => {
//     const id = parseInt(req.params.id);
//     const {
//         name,
//         email
//     } = req.body;

//     pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id], (err, data) => {
//         if (err) {
//             return res.status(500).json(err);
//         }
//         res.status(200).json(data);
//     });
// };

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        name,
        email
    } = req.body;
    const UPDATEsql = "UPDATE users SET name = $1, email = $2 WHERE id = $3";
    pool.query(UPDATEsql, [name, email, id]).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json(err);
    });
};


// const deleteUser = (req, res) => {
//     const id = parseInt(req.params.id);
//     pool.query("DELETE FROM users WHERE id = $1", [id], (err, data) => {
//         if (err) {
//             return res.status(500).json(err);
//         }
//         res.status(200).json(data);
//     });
// };

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const DELETEsql = "DELETE FROM users WHERE id = $1";
    pool.query(DELETEsql, [id]).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json(err);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};