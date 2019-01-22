const db = require("../db/index.js");
const uuid = require("uuid");

exports.getTransactions = async (req, res) => {
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

exports.createTransaction = async (req, res) => {
    const {
        sender,
        receiver
    } = req.body;
    const amount = parseFloat(req.body.amount);
    console.log(amount);
    console.log(typeof amount);
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