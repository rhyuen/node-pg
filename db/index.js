const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

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

module.exports = {
    query(text, params) {
        return new Promise((resolve, reject) => {
            pool.query(text, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }
};