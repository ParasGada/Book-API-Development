const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    ISBN:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    authors:Array,
    language:String,
    pubDate:String,
    numOfPage:Number,
    category:Array,
    publication:Number,
});

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;