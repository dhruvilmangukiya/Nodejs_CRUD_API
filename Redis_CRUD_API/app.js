require("dotenv").config();
require("./database/config");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { errorHandler } = require("./utils/errorHandler");
const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Index route
const indexRoute = require("./routes/index");
app.use("/", indexRoute);
app.use(errorHandler);


app.listen(PORT,() => {
    console.log(`Connection Successfully On ${PORT} Port Number`);
});