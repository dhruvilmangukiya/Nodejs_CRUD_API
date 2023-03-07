const userModel = require("../models/user");
const fs = require('fs');
const Joi = require("joi");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

function deleteFile(image) {
    const imagePath = path.join(__dirname, "../images/");
    fs.unlinkSync(imagePath + image);
}

// 1. Create user
const signUp = async(req, res, next) => {
    try{
        const data = req.body;
        let image = null;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            gender: Joi.string().required(),
            interest: Joi.array().required(),
        });

        const {error} = schema.validate(data);
    
        if(error){
            return next(Boom.badData(error.message));
        } 

        const isUserExists = await userModel.findOne({ email : data.email});
        if (isUserExists) return next(Boom.badData(messages.RECORD_ALREADY_EXISTS));

        if(data.password.length < 8){
            return res.status(422).json({ 
                statusCode: 422,
                message:"Passwords must contain at least 8 characters." 
            });
        }

        const user = await userModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            interest: data.interest,
            image: image,
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

// 2. Login user
const signIn = async (req, res, next) => {
    try{
        const data = req.body;

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(data);

        if(error) return next(Boom.badData(error.message));

        const user = await userModel.findOne({ email :data.email });
        if(!user) return next(Boom.notFound(messages.RECORD_NOT_FOUND));

        if (!await bcrypt.compare(data.password, user.password)) {
            return next(Boom.unauthorized(messages.INVALID_CREDENTIALS));
        }

        // Create token
        const token = jwt.sign(
        { 
            user_id: user._id,
            user_email: user.email
        }, process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        });

        res.status(200).json({
            statusCode:200,
            message: "Login Successfully", token: token
        });
    }
    catch(err){
        return next(Boom.badImplementation());
    }
}

// 3. Change password
const changePassword = async(req, res, next) => {
    try{
        const data = req.body;
        const id = req.user;
    
        const schema = Joi.object().keys({
            oldpwd: Joi.string().required(),
            newpwd: Joi.string().required(),
            cpwd: Joi.string().required(),
        })
        
        const { error } = schema.validate(data);
        if(error) return next(Boom.badData(error.message));

        const user = await userModel.findById( id );

        if(!await bcrypt.compare(data.oldpwd, user.password)) {
            return next(Boom.badData(messages.OLD_PWD_WRONG));
        }
        
        if(!(data.newpwd === data.cpwd)){
            return res.status(422).json({ 
                statusCode: 422,
                message: "New Password And Old Password Not Match" 
            });
        } 
        
        const newHashPwd = await bcrypt.hash(data.newpwd,10);

        await userModel.findByIdAndUpdate(id, {
            password:newHashPwd
        });

        res.status(200).json({ 
            statusCode: 200,
            message: "Password Changed Successfully" 
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 4. Get all user
const getUsersDetails = async(req, res, next) => {
    try{
        const users = await userModel.find().select('-password').exec();
        res.status(200).json({
            statusCode: 200,
            result: users || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 5. User pagination
const paginationUser = async (req, res, next) => {
    try{
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;
        let skip = 0;
        skip = limit * (page - 1)
        
        const users = await userModel.find().limit(limit).skip(skip).exec();

        res.status(200).json({
            statusCode: 200,
            result: users || []
        });
    }
    catch(error){
        return next(Boom.badImplementation());
    }
}

// 6. Get single user
const getUserById = async(req, res, next) => {
    try{
        const { id } = req.params;
        const user = await userModel.findById(id).select('-password').exec();
    
        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        
        res.status(200).json({
            statusCode: 200,
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 7. Update user
const updateUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;

        const user = await userModel.findById( id );
        
        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));       

        if (req.file && user.image != null) deleteFile(user.image)
        let updateImg = req.file ? req.file.filename : user.image;

        const updateUser = await userModel.findByIdAndUpdate(id, {
            name : data.name, 
            gender : data.gender, 
            interest : data.interest, 
            image : updateImg, 
            createdAt:user.createdAt, 
            updatedAt:new Date()
        },{
            new : true
        });

        res.status(200).json({
            statusCode: 200,
            message: `User ${id} updted successfully`,
            result: updateUser
        });
    }catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}

// 8. Delete user
const deleteUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;

        const user  = await userModel.findByIdAndDelete( id ); 
        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        deleteFile(user.image);

        res.status(200).json({
            statusCode: 200,
            message: `User ${id} deleted successfully`
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

module.exports = {
    signUp,
    signIn,
    changePassword,
    getUsersDetails,
    paginationUser,
    getUserById,
    updateUserDetails,
    deleteUserDetails
}