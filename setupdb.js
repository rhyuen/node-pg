const uuid = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db/index.js");

const createTableUsers = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users(
        user_id UUID PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE, 
        password TEXT NOT NULL,        
        email_confirm BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )`;

    db.query(createTableQuery).then(res => {
        console.log(res);
    }).catch(e => {
        console.log(e);
    });
};

const createTableTransactions = async () => {
    const createTransactionsQuery = `CREATE TABLE IF NOT EXISTS transactions(
        transaction_id UUID PRIMARY KEY,
        sender UUID NOT NULL REFERENCES accounts (account_id),
        receiver UUID NOT NULL REFERENCES accounts (account_id),
        amount NUMERIC(8, 2) NOT NULL,
        type transaction NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )`;
    db.query(createTransactionsQuery).then(res => {
        console.log(res);
        console.log("success");
    }).catch(e => {
        console.log("Error occured");
        console.log(e);
    });
};
const dropTables = async () => {
    try {
        const dropTransactionsTable = "DROP table if exists transactions";
        const dropAccountsTable = "DROP TABLE IF EXISTS accounts";
        const dropUsersTable = "DROP table if exists users";

        await db.query(dropTransactionsTable);
        await db.query(dropAccountsTable);
        await db.query(dropUsersTable);
    } catch (e) {
        console.log(e);
    }
};

const fillUsersTable = async () => {
    const insertUserQuery = `insert into users(
        user_id, name, email, password
    ) values($1, $2, $3, $4)`;
    const rng = Math.floor(Math.random() * 1000);

    const dummyData = [{
        name: `apple${rng}`,
        email: `apple${rng}@apple.ca`,
        password: 'apple'
    }, {
        name: `orange${rng}`,
        email: `orange${rng}@orange.ca`,
        password: 'orange'
    }, {
        name: `lemon${rng}`,
        email: `lemon${rng}@lemon.ca`,
        password: 'lemon'
    }, {
        name: `peach${rng}`,
        email: `peach${rng}@peach.ca`,
        password: 'peach'
    }, {
        name: `pear${rng}`,
        email: `pear${rng}@pear.ca`,
        password: 'pear'
    }];

    try {
        const prm = dummyData.map(item => {

            return new Promise((resolve, reject) => {
                const saltRounds = 10;
                bcrypt.hash(item.password, saltRounds).then(hashedPw => {
                    resolve(db.query(insertUserQuery, [
                        uuid.v4(), item.name, item.email, hashedPw
                    ]));
                }).catch(e => {
                    console.log(e);
                });
            });
        });
        await Promise.all(prm);
    } catch (e) {
        console.log(e);
    }
};

const fillTransactionsTable = async () => {
    const getAccounts = `select account_id from accounts;`;
    const createTransaction = `insert into transactions(
        transaction_id, sender, receiver, amount, type
    ) values($1, $2, $3, $4, $5)`;
    const {
        rows
    } = await db.query(getAccounts);

    //for multiple tx for each acct
    const moreRows = rows.concat(rows);
    const transactionPromises = moreRows.map((r, index) => {
        const transactionAmt = Math.floor(Math.random() * 1000);
        return new Promise((resolve, reject) => {
            const sender = r.account_id;

            //self on even else random
            const receiver = (index % 2 === 0) ?
                r.account_id :
                rows[Math.floor(Math.random() * 1000) % rows.length].account_id;


            const finalTransactionAmt = transactionAmt * (index % 4 === 0 ? -1 : 1);
            const type = (sender === receiver) ?
                ((finalTransactionAmt > 0) ? 'deposit' : 'withdraw') :
                'transfer';

            resolve(db.query(createTransaction, [
                uuid.v4(), sender, receiver, finalTransactionAmt, type
            ]));
        });
    });

    try {
        const res = Promise.all(transactionPromises);
        console.log(res);
    } catch (e) {
        console.log(e);
    }

};

const createTableAccounts = async () => {
    const makeAccountsTable = `create table if not exists accounts(
        account_id UUID primary key,
        user_id UUID not null references users(user_id),
        type account_type default 'savings',
        balance NUMERIC(8, 2) not null default 0.00,        
        created_at TIMESTAMP not null default current_timestamp,
        last_modified TIMESTAMP not null default current_timestamp
    )`;

    try {
        const data = await db.query(makeAccountsTable);
        console.log(data);
    } catch (e) {
        console.log(e);
    }
};

const fillAccountsTable = async () => {
    const insertIntoAccounts = `insert into accounts(
        account_id, user_id, type, balance
    ) values($1, $2, $3, $4)`;
    const getUsersForAccounts = `select user_id from users`;

    const {
        rows
    } = await db.query(getUsersForAccounts);

    const listOfPrms = rows.map(row => {
        const balance = Math.floor(Math.random() * 1000);
        const type = balance % 2 ? 'savings' : 'chequing';

        return new Promise((resolve, reject) => {
            resolve(db.query(insertIntoAccounts, [
                uuid.v4(), row.user_id, type, balance
            ]));
        })
    })
    const res = await Promise.all(listOfPrms);
    console.log(res);
};

const createTablesAll = async () => {
    //TODO: Only Users Table is created.  Then it crashes.
    //TODO: returns .success property
    try {
        console.log("not done.");
        const usersResult = await createTableUsers();
        console.log(usersResult);
        const accountsResult = await createTableAccounts();
        console.log(accountsResult);
        const transactionsResult = await createTableTransactions();
        console.log(transactionsResult);
    } catch (e) {

        dropTables();
        console.log("catch statement");
    }
};

module.exports = {
    createTableUsers,
    fillUsersTable,
    createTableTransactions,
    fillTransactionsTable,
    dropTables,
    createTablesAll,
    createTableAccounts,
    fillAccountsTable
};

require("make-runnable");