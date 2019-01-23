const db = require("../db/index.js");
const uuid = require("uuid");

exports.getAllTransactions = async (req, res) => {
    const getTransactions = `select * from transactions`;
    try {
        const data = await db.query(getTransactions);
        res.status(200).json({
            data: data.rows,
            count: data.rows.length
        });
    } catch (e) {
        res.status(500).json({
            err: e
        });
    }

};

exports.addRemoveFundsTransaction = async (req, res) => {
    const {
        receiver,
        amount,
        transactionType
    } = req.body;
    const beginQuery = "begin transaction";
    const addTransactionQuery = `insert into transactions(
        transaction_id, sender, receiver, amount
        ) values($1, $2, $2, $3)`;
    const operator = (transactionType === "deposit") ? "+" : "-";
    const balanceChangeQuery = `
        update users 
        set balance = balance + $2, last_modified = CURRENT_TIMESTAMP 
        where user_id = $1        
        returning *
    `;
    const commitQuery = "commit";

    try {
        await db.query(beginQuery);
        await db.query(addTransactionQuery, [uuid.v4(), receiver, amount]);
        const data = await db.query(balanceChangeQuery, [receiver, amount]);
        await db.query(commitQuery);
        res.status(201).json({
            data: data.rows
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};

exports.getTransactionById = async (req, res) => {
    const transaction_id = req.params.id;
    const transactionById = `select * from transactions where transaction_id = $1`;
    try {
        const result = await db.query(transactionById, [transaction_id]);
        res.status(200).json({
            data: result.rows[0]
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }

};

exports.createFundsTransferTransaction = async (req, res) => {
    const {
        sender,
        receiver
    } = req.body;
    const amount = parseFloat(req.body.amount);
    const transactionUpdate = `insert into transactions(transaction_id, sender, receiver, amount) values($1, $2, $3, $4) returning *`;
    const senderUpdate = `update users set balance = balance - $2, last_modified = CURRENT_TIMESTAMP where user_id = $1;`
    const receiverUpdate = `update users set balance = balance + $2, last_modified = CURRENT_TIMESTAMP where user_id = $1;`

    try {
        await db.query("begin transaction");
        const data = await db.query(transactionUpdate, [uuid.v4(), sender, receiver, amount]);
        await db.query(senderUpdate, [sender, amount]);
        await db.query(receiverUpdate, [receiver, amount]);
        await db.query("commit transaction");
        res.status(200).json({
            data: data.rows
        });
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
};