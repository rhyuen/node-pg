require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./routes/router.js");
const PORT = 8023;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(router);

app.listen(PORT, () => {
    console.log(`${PORT} is the PORT the PG app is on.`)
});