const { Entity, Schema } = require('redis-om');
const client = require("../database/config");

class user extends Entity {}

const userschema = new Schema(user, {
    name: { 
        type: 'string' 
    }, 
    email: { 
        type: 'string' 
    }, 
    password: {
        type: 'string' 
    }, 
    gender: { 
        type: 'string' 
    },
    interest: {
        type: 'string[]'
    },
    active: {
        type:'boolean'
    },
    createdAt:{
        type: 'date'
    },
    updatedAt:{
        type: 'date'
    }
},{
    dataStructure: 'HASH'
});

const userModel = client.fetchRepository(userschema);

module.exports = userModel;
