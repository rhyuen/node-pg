const express = require("express");
const router = express.Router();
const User = require("../controllers/users.js");
const Transaction = require("../controllers/transactions.js");

router.get("/", (req, res) => {
    res.status(200).json({
        message: 'hi, bank api thing here.'
    });
});


//get all users, add new user
router.get("/users", User.getUsers)
    .post("/users", User.createUser);

router.get("/users/:id", User.getUserById)
    .put("/users/:id", User.updateUser)
    .delete("/users/:id", User.deleteUser);

router.put("/users/:id/emailconfirm", User.editEmailConfirm);



//Get all transactions
router.get("/transactions", Transaction.getAllTransactions);

//Deposit or Withdraw funds
router.post("/transactions", Transaction.addRemoveFundsTransaction);

//Get Specific Transaction
router.get("/transactions/:id", Transaction.getTransactionById);

//Give money to another user
router.post("/transactions/transfer", Transaction.createFundsTransferTransaction);



module.exports = router;