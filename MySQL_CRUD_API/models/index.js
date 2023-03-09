const { Sequelize,DataTypes } = require('sequelize');
const dbconfig = require("../database/config");

// connection with database
const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,{
        host: dbconfig.host,
        dialect: dbconfig.dialect,
        logging:false
    }
);

sequelize.authenticate()
.then(() => {
    console.log('Connection successfully.');
})
.catch((error) => {
    console.error('Connection failed:', error);
});


// table created 
const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize

db.users = require('./user')(sequelize,DataTypes);
db.books = require('./book')(sequelize,DataTypes);

db.users.hasMany(db.books,{ foreignkey: `userId` });

db.sequelize.sync({force: false})
.then(() => {
    console.log('yes re-sync done!');
});

module.exports = db;