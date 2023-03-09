require("dotenv").config();
const express = require('express');    
const app = express();
const bodyParser = require('body-parser');
const { errorHandler } = require("./utils/errorHandler");
const port = process.env.PORT || 3000;
require("./models/index");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routers
const indexRoute = require("./routes/index");
app.use("/", indexRoute);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`App is run on port no ${port}`);
})