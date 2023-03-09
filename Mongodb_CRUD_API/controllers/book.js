const bookModel = require("../models/book");
const Boom = require("@hapi/boom");
const { messages } = require("../utils/message");
const Joi = require("joi");

// 1. Create book
const createBook = async(req, res, next) => {
    try{
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

        const addbook = new bookModel(req.body);
        const book = await addbook.save();

        res.status(201).json({
            statusCode: 201,
            message: 'Book created successfully',
            result: book
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 2. Get all book
const getBooksDetails = async(req, res, next) => {
    try{
        const books = await bookModel.find({}).sort({"name":1});

        res.status(200).json({
            statusCode: 200,
            result: books || []
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 3. Book pagination
const paginationBook = async (req, res, next) => {
    try{
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;
        let skip = 0;
        skip = limit * (page - 1)
        
        const books = await bookModel.find({ }).limit(limit).skip(skip).exec();
        res.status(200).json({
            statusCode: 200,
            result: books || []
        });
    }
    catch(error){
        return next(Boom.badImplementation());
    }
}

// 4. Get single book
const getBookById = async(req, res, next) => {
    try{
        const { id } = req.params;
        const book = await bookModel.findById(id);
    
        if (!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));
        res.status(200).json({
            statusCode: 200,
            result: book
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 5. Update book
const updateBookDetails = async(req, res, next) => {
    try{
        const { id } = req.params;

        const book = await bookModel.findById( id );
        if (!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        const data = req.body;

        const updateBook = await bookModel.findByIdAndUpdate(id,{ 
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
        },{ 
            new : true,
        });

        res.status(200).json({
            statusCode: 200,
            message: `Book ${id} updted successfully`,
            result: updateBook
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

// 6. Delete Book
const deleteBookDetails = async(req, res, next) => {
    try{
        const { id } = req.params;

        const book = await bookModel.findByIdAndDelete( id ); 
        if(!book) return next(Boom.badData(messages.RECORD_NOT_FOUND));

        res.status(200).json({
            statusCode: 200,
            message: `Book ${id} deleted successfully`
        });
    }catch(error){
        return next(Boom.badImplementation());
    }
}

module.exports = {
    createBook,
    getBooksDetails,
    paginationBook,
    getBookById,
    updateBookDetails,
    deleteBookDetails
}