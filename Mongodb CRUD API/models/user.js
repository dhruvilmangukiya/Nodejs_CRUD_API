const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const user = new Schema({
    name:{
        type:String,
        required:[true, 'Name must be required'],
        trim: true
    },
    email:{
        type:String,
        required:[true, 'Email must be required'],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true, 'Password must be required'],
    },
    gender:{
        type:String,
        required:[true, 'Gender must be required'],
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported'
        }
    },
    interest:{
        type:Array,
        required:[true, 'Interest must be required'],
        trim:true
    },
    image:{
        type:String
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
    timestamps:false,
});

// Password hash
user.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Pre hook for `findOneAndUpdate`
user.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

const userModel = new mongoose.model("user",user);
module.exports = userModel;