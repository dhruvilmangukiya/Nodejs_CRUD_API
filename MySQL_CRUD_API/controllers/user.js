const db = require("../models/index.js");
const User = db.users;
const jwt = require("jsonwebtoken");
const fs = require('fs');
const bcrypt = require("bcrypt");
const Joi = require("joi");
const path = require("path");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message")

function deleteFile(image) {
    const imagePath = path.join(__dirname, "../Images/");
    fs.unlinkSync(imagePath + image);
}

// 1 Add user 
const signUp = async (req, res, next) => {
    try{
        const data = req.body;
        let image = "";
        image = req.file ? req.file.filename : null;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            gender: Joi.string().required(),
            interest: Joi.array().required(),
        });

        const {error} = schema.validate(data);
      
        if (error) {
            deleteFile(image);
            return next(Boom.badData(error.message));
        } 

        const isUserExists = await User.findOne({ where : {email:data.email} });
        if (isUserExists) {
            deleteFile(image);
            return next(Boom.badData(messages.RECORD_ALREADY_EXISTS));
        }

        const user = await User.create({
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

        const user = await User.findOne({ 
            where : { email :data.email }
        });

        if(!user) return next(Boom.notFound(messages.RECORD_NOT_FOUND));

        if (!await bcrypt.compare(data.password, user.password)) {
            return next(Boom.unauthorized(messages.INVALID_CREDENTIALS));
        }

        // Create token
        const token = jwt.sign(
            { 
                user_id: user.id,
                user_email: user.email
            }, process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        res.status(200).json({
            statusCode:200,
            message: "Login Successfully", token: token
        });
    }
    catch(error){
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

        const user = await User.findOne({ where : { id }});

        if(!await bcrypt.compare(data.oldpwd, user.password)) {
            return next(Boom.badData(messages.OLD_PWD_WRONG));
        }
        
        if(!(data.newpwd == data.cpwd)){
            return res.status(422).json({ 
                statusCode: 422,
                message: "New Password And Old Password Not Match" 
            });
        } 
        
        const newHashPwd = await bcrypt.hash(data.newpwd,10);
        await User.update({password:newHashPwd}, {where : { id }});

        res.status(200).json({ 
            statusCode: 200,
            message: "Password Changed Successfully" 
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 4. Get all users
const getUsersDetails = async (req, res, next) => {
    try{
        const users = await User.findAll({
            attributes:{
                exclude:['password']
            }
        });
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
        let limit = 0;
        let offset = 0;

        const page = Number(req.query.page)
        limit = Number(req.query.limit)
        offset = limit * (page - 1)
        
        const users = await User.findAll({ limit, offset });

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
const getUserById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({
            where :{ id },
            attributes:{
                exclude:['password']
            }
        });

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
const updateUserDetails = async (req, res, next) => {
    try{
        const { id } = req.params;
        const data = req.body;

        let user = await User.findOne({where :{ id }});
        
        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            gender: Joi.string().required(),
            interest: Joi.array().required(),
        });

        const {error} = schema.validate(data);

        if (error) return next(Boom.badData(error.message));

        if(req.file){
            deleteFile(user.image);
        }

        let updateImg;
        updateImg = req.file ? req.file.filename : user.image;

        await User.update({
            name : data.name, 
            gender : data.gender, 
            interest : data.interest, 
            image : updateImg, 
            createdAt:user.createdAt, 
            updatedAt:new Date()
        }, 
        {
            where :{ id }
        });

        user = await User.findOne({where :{ id }});
        res.status(200).json({
            statusCode: 200,
            message: `User ${id} updted successfully`,
            result: user
        });
    }
    catch(error){
        req.file ? deleteFile(req.file.filename) : "";
        return next(Boom.badImplementation());
    }
}

// 8. Delete user
const deleteUserDetails = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({where :{ id }});

        if(!user) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await User.destroy({where :{ id }});
        deleteFile(user.image);
        
        res.status(200).json({
            statusCode: 200,
            message: `User ${id} deleted successfully`
        });
    }
    catch(error){
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