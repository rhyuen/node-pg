require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/router.js");
const PORT = 8023;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);

app.listen(PORT, () => {
    console.log(`${PORT} is the PORT the PG app is on.`)
});