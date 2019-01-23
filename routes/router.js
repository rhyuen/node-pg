const express = require("express");
const router = express.Router();
const User = require("../controllers/users.js");
const Transaction = require("../controllers/transactions.js");

router.get("/", (req, res) => {
    res.status(200).json({
        message: 'hi'
    });
});

router.get("/users", User.getUsers);
router.get("/users/:id", User.getUserById);
router.post("/users", User.createUser);
router.put("/users/:id", User.updateUser);
router.delete("/users/:id", User.deleteUser);

router.get("/transactions", Transaction.getAllTransactions)
    .post("/transactions", Transaction.addRemoveFundsTransaction);

router.get("/transactions/:id", Transaction.getTransactionById);

router.post("/transactions/transfer", Transaction.createFundsTransferTransaction);



module.exports = router;