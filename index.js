require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const BookApi = require("./API/books");
const AuthorApi = require("./API/authors");
const PublicationApi = require("./API/publications");

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(()=>console.log("Connection Established")).catch((error)=>console.log(error));

const app = express();

app.use(express.json());

app.use("/book",BookApi);
app.use("/author",AuthorApi);
app.use("/publication",PublicationApi);

app.get("/",(req,res)=>{
    return res.json({message:"Request Served"});
});

app.listen(4000,()=>{
    console.log("Server is Running");
});