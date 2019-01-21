const express = require("express");
const router = express.Router();
const db = require("../controllers/users.js");

router.get("/", (req, res) => {
    res.status(200).json({
        message: 'hi'
    });
});

router.get("/users", db.getUsers);
router.get("/users/:id", db.getUserById);
router.post("/users", db.createUser);
router.put("/users/:id", db.updateUser);
router.delete("/users/:id", db.deleteUser);

module.exports = router;