const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    id:Number,
    name:String,
    books:Array,
  });

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;