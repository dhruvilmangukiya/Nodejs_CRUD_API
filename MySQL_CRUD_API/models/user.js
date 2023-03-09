const {genSaltSync,hashSync} = require("bcrypt");
const salt =  genSaltSync(10, 'a');


module.exports = (sequelize,DataTypes) =>{

    const User = sequelize.define('user', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['male','female','Male','Female']],
            }
        },
        interest: {
            type: DataTypes.JSON
        },
        image:{
            type: DataTypes.STRING
        },
        createdAt:{
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        updatedAt:{
            type: DataTypes.DATE,
            defaultValue: new Date()
        }
    },
    {
        timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await hashSync(user.password, salt);
                }
            }
        }
    });
    
    return User;
}


