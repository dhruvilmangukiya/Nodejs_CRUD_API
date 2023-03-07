const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/CoreAPI").
then(() => {
    console.log("Database Connected");
}).catch((error) => {
    console.log("Database Not Conected",error);
});