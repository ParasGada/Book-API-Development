const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema({
    id:Number,
    name:String,
    books:Array,
  });

const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;