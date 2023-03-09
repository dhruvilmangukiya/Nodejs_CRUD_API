module.exports = (sequelize,DataTypes) =>{

    const Book = sequelize.define('book', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        noOfPage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        releasedYear: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                isIn: [['true','false']],
            }
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
    });
    
    return Book;
}


