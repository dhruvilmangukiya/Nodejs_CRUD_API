const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const book = new Schema({
    name:{
        type:String,
        required:[true, 'Name must be required'],
        trim: true
    },
    description:{
        type:String,
        required:[true, 'Description must be required'],
        trim:true
    },
    noOfPage:{
        type:Number,
        required:[true, 'Number of pages must be required'],
        trim:true,
        min: [100, 'Minimum 100 Page Required'],
    },
    author:{
        type:String,
        required:[true, 'Author must be required'],
        trim:true
    },
    category:{
        type:String,
        required:[true, 'Category must be required'],
        trim:true
    },
    price:{
        type:Number,
        required:[true, 'Price must be required'],
        trim:true,
        min: 0
    },
    releasedYear:{
        type:Number,
        required:[true, 'Released year must be required'],
        trim:true
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type: Date,
        defaultValue: new Date()
    },
    updatedAt:{
        type: Date,
        defaultValue: new Date()
    }
},{
    timestamps:false
});

// Pre hook for `findOneAndUpdate`
book.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

const bookModel = new mongoose.model("book",book);
module.exports = bookModel;