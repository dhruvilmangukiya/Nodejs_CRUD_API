const userModel = require('../models/user');
const bcrypt = require("bcrypt");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

//1. User Create
const signUp = async(req, res, next) => {
    try{
        const { name, email, password, gender, interest } = req.body;
        const hashPassword = bcrypt.hashSync(password,10);

        const user = await userModel.createAndSave({
            name,
            email,
            password: hashPassword,
            gender,
            active:true,
            interest,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        res.status(201).json({
            statusCode: 201,
            message: 'User created successfully',
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

//2. Get All Record
const getUsersDetails = async(req, res, next) => {
    try{
        const userDetails = await userModel.keys('*');
        res.status(200).json({
            statusCode: 200,
            result: userDetails || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

//3. Get Single Record
const getUserById = async(req, res, next) => {
    try{
        const { id } = req.params;
        const user = await userModel.fetch(id);

        if(!user.name) return next(Boom.notFound(messages.RECORD_NOT_FOUND));

        return res.status(200).json({
            statusCode: 200,
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

//4. Update User
const updateUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;
        const { name, email, password, gender, interest, active} = req.body;

        const user = await userModel.fetch(id);

        if(!user.name) return next(Boom.notFound(messages.RECORD_NOT_FOUND));
        
        const hashPassword = password ? bcrypt.hashSync(password,10) : user.password;

        user.name = name ? name : user.name;
        user.email = email ? email : user.email;
        user.password = hashPassword;
        user.gender = gender ? gender : user.gender;
        user.interest = interest ? interest : user.interest;
        user.active = active === true ? true : false;
        user.updatedAt = new Date();

        await userModel.save(user);
        res.status(200).json({
            statusCode: 200,
            message: 'User updated successfully',
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

//5. Delete User
const deleteUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;
        const user = await userModel.fetch(id);

        if(!user.name) return next(Boom.notFound(messages.RECORD_NOT_FOUND));

        await userModel.remove(id);
        res.status(200).json({
            statusCode: 200,
            message : `User ${id} deleted successfully`
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

module.exports = {
    signUp,
    getUsersDetails,
    getUserById,
    updateUserDetails,
    deleteUserDetails
}