const { Client } = require('redis-om');

const client = new Client();

client.open('redis://localhost:6379')
.then(() => {
    console.log("Connection successfully");
})
.catch((error) => {
    console.log("Connection Failed", error);
});

module.exports = client;