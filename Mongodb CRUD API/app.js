require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
require("./database/config");
const { errorHandler } = require("./utils/errorHandler");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routers
const indexRoute = require("./routes/index");
app.use("/", indexRoute);
app.use(errorHandler);


app.listen(process.env.PORT,() => {
    console.log(`Connection Successfully On ${process.env.PORT} Port Number`);
})