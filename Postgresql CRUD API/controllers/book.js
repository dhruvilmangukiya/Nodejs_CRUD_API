const db = require("../models/index.js");
const Book = db.books;
const User = db.users;
const Joi = require("joi");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");

// 1. Add Book
const createBook = async (req, res, next) => {
    try {
        const data = req.body;

        const schema = Joi.object().keys({
            userId: Joi.number().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            noOfPage: Joi.number().required(),
            author: Joi.string().required(),
            category: Joi.string().required(),
            price: Joi.number().required(),
            releasedYear: Joi.number().required(),
            status: Joi.boolean().required(),
        });

        const {error} = schema.validate(data);
        if (error) return next(Boom.badData(error.message));

        const book = await Book.create(data);

        res.status(201).json({
            statusCode: 201,
            message: 'Book created successfully',
            result: book
        });
    } catch (error) {
        return next(Boom.badImplementation());
    }
}

// 2. Get all book
const getBooksDetails = async (req, res, next) => {
    try{
        const books = await Book.findAll({ });
        res.status(200).json({
            statusCode: 200,
            result: books || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }   
}

// 3. Foreignkey concept
const oneToMany = async (req, res, next) => {
    try{
        const books = await User.findAll({ 
            attributes: ['id','name','email'],
            include:{
                model: Book
            },
            where :{ id:2 }
        });
        return res.status(200).json({
            statusCode: 200,
            result: books || []
        });
    }catch(error){
        console.log(error);
        return next(Boom.badImplementation());
    }   
}

// 4. Book pagination
const paginationBook = async (req, res, next) => {
    try{
        let limit = 0;
        let offset = 0;

        const page = Number(req.query.page)
        limit = Number(req.query.limit)
        
        offset = limit * (page - 1)
        
        const books = await Book.findAll({ limit, offset });

        res.status(200).json({
            statusCode: 200,
            result: books || []
        });
    }
    catch(error){
        return next(Boom.badImplementation());
    }
}

// 5. Get single book
const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({ where: { id } });

        if (!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        res.status(200).json({
            statusCode: 200,
            result: book
        });
    } catch (error) {
        return next(Boom.badImplementation());
    }
}

// 6. Update book
const updateBookDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        let book = await Book.findOne({ where: { id } });
        if (!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        const data = req.body;

        const schema = Joi.object().keys({
            userId: Joi.number().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            noOfPage: Joi.number().required(),
            author: Joi.string().required(),
            category: Joi.string().required(),
            price: Joi.number().required(),
            releasedYear: Joi.number().required(),
            status: Joi.boolean().required(),
        });

        const {error} = schema.validate(data);
        
        if (error) return next(Boom.badData(error.message));

        await Book.update({ 
            userId : data.userId, 
            name : data.name, 
            description : data.description, 
            noOfPage : data.noOfPage, 
            author : data.author, 
            category : data.category, 
            price : data.price, 
            releasedYear : data.releasedYear, 
            status : data.status, 
            createdAt:book.createdAt, 
            updatedAt:new Date()
        }, 
        { 
            where: { id } 
        });

        book = await Book.findOne({ where: { id } });
        res.status(200).json({
            statusCode: 200,
            message: `Book ${id} updted successfully`,
            result: book
        });
    }
    catch (error) {
        return next(Boom.badImplementation());
    }
}

// 7. Delete book
const deleteBookDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({ where: { id } });
            
        if (!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        await Book.destroy({ where: { id } });

        res.status(200).json({
            statusCode: 200,
            message: `Book ${id} deleted successfully`
        });
    }
    catch (error) {
        return next(Boom.badImplementation());
    }
}

module.exports = {
    createBook,
    getBooksDetails,
    oneToMany,
    paginationBook,
    getBookById,
    updateBookDetails,
    deleteBookDetails
}