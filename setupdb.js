const {
    Pool,
    Client
} = require("pg");
const uuid = require("uuid")

require('dotenv').config();

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

pool.on("connect", () => {
    try {
        console.log("Connected to PG DB");
    } catch (e) {
        console.log(`something went wrong: ${e}`);
    }
});

const createTableUsers = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users(
        user_id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL, 
        password TEXT NOT NULL,
        balance NUMERIC(8,2) DEFAULT 0.00,
        email_confirm BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )`;

    pool.query(createTableQuery).then(res => {
        console.log(res);
        pool.end();
    }).catch(e => {
        console.log(e);
        pool.end();
    });
};

const createTableTransactions = async () => {
    const createTransactionsQuery = `CREATE TABLE IF NOT EXISTS transactions(
        transaction_id UUID PRIMARY KEY,
        sender uuid NOT NULL REFERENCES users (user_id),
        receiver uuid NOT NULL REFERENCES users (user_id),
        amount NUMERIC(8, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )`;
    pool.query(createTransactionsQuery).then(res => {
        console.log(res);
        console.log("success");
        pool.end();
    }).catch(e => {
        console.log("Error occured");
        console.log(e);
        pool.end();
    });
};
const dropTables = async () => {
    try {
        const dropTransactionsTable = "drop table if exists transactions";
        const dropUsersTable = "drop table if exists users";

        await pool.query(dropTransactionsTable);
        await pool.query(dropUsersTable);
    } catch (e) {
        console.log(e);
    } finally {
        pool.end();
    }
};

const fillUsersTable = async () => {
    const insertUserQuery = `insert into users(
        user_id, name, email, password
    ) values($1, $2, $3, crypt($4, gen_salt('bf')))`;

    const dummyData = [{
        name: 'apple',
        email: 'apple@apple.ca',
        password: 'apple'
    }, {
        name: 'orange',
        email: 'orange@orange.ca',
        password: 'orange'
    }, {
        name: 'lemon',
        email: 'lemon@lemon.ca',
        password: 'lemon'
    }, {
        name: 'peach',
        email: 'peach@peach.ca',
        password: 'peach'
    }, {
        name: 'pear',
        email: 'pear@pear.ca',
        password: 'pear'
    }];


    try {
        const prm = dummyData.map(item => {
            return new Promise((resolve, reject) => {
                resolve(pool.query(insertUserQuery, [
                    uuid.v4(), item.name, item.email, item.password
                ]));
            })
        })
        const res = await Promise.all(prm);

        console.log(res)

    } catch (e) {
        console.log(e);
    } finally {
        pool.end();
    }
};

const fillTransactionsTable = async () => {

};

module.exports = {
    createTableUsers,
    fillUsersTable,
    createTableTransactions,
    fillTransactionsTable,
    dropTables
};

require("make-runnable");