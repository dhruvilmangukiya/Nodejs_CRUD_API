const ref  = require('../database/config');
const bcrypt = require("bcrypt");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

// Create User 
const signUp = async (req, res, next) => {
    try{
        const { name, email, password, gender, interest, active} = req.body;

        const emailExists = await ref.where("email", '==', email).get();
        
        if(!emailExists.empty) return next(Boom.badData(messages.RECORD_ALREADY_EXISTS))

        const hashPassword = await bcrypt.hashSync(password, 10) ;

        const user = {
            name ,
            email : email.toLowerCase(),
            password : hashPassword,
            gender,    
            interest,
            active,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        await ref.add(user);
        res.status(201).json({
            statusCode: 201,
            message: 'User created successfully',
            result: user
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 2. Get all user
const getUsersDetails = async (req, res, next) => {
    try{
        const user = await ref.get();
        const userData = user.docs.map(doc => doc.data());

        res.status(200).json({
            statusCode: 200,
            result: userData || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 3. Get single user
const getUserById = async(req, res, next) => {
    try{
        const { id } = req.params;
        const userExists = await ref.doc(id).get();

        if(!userExists.exists) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await ref.doc(id).get()
        .then(doc => {
            res.status(200).json({
                statusCode: 200,
                result: doc.data()  
            });
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 4. Update user
const updateUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;

        const user = await ref.doc(id).get();
        if(!user.exists) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        const { name, email, password, gender, interest, active } = req.body;
        const hashPassword = await bcrypt.hashSync(password, 10) ;

        await ref.doc(id).update({
            name ,
            emai : email.toLowerCase(),
            password: hashPassword,
            gender,    
            interest,
            active,
            updatedAt: Date.now()
        });

        await ref.doc(id).get()
        .then(doc => {
            res.status(200).json({
                statusCode: 200,
                message: "User updated successfully",
                result: doc.data()
            });
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 5. Delete user
const deleteUserDetails = async(req, res, next) => {
    try{
        const { id } = req.params;

        const deleteuser = await ref.doc(id).get();
        if(!deleteuser.exists) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await ref.doc(id).delete();
        res.status(200).json({
            statusCode: 200,
            message: "User deleted successfully"
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