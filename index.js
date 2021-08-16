const express = require("express");

const Database = require("./database");

const app = express();

app.get("/",(req,res)=>{
    res.json({message:"Request Served"});
});

//Route         - /book
//Description   - to get all books
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/book",(req,res)=>{
    res.json({Books:Database.Book})
});

//Route         - /book/:bookID
//Description   - to get specific books
//Access        - public
//Method        - GET
//Params        - bookID
//Body          - none
app.get("/book/:bookID",(req,res)=>{
    const getBook = Database.Book.filter((book)=>book.ISBN===req.params.bookID);
    res.json({Book:getBook});
});

//Route         - /book/:bookID
//Description   - to get a list of books based on category
//Access        - public
//Method        - GET
//Params        - catergory
//Body          - none
app.get("/book/c/:category",(req,res)=>{
    const getBook = Database.Book.filter((book)=>book.category.includes(req.params.category));
    res.json({Book:getBook});
});

//Route         - /book/a/:author
//Description   - to get a list of books based on author
//Access        - public
//Method        - GET
//Params        - author
//Body          - none
app.get("/book/a/:author",(req,res)=>{
    const findAuthor = Database.Author.filter((author)=>author.name===req.params.author).reduce((author)=>author.id);
    authorID= findAuthor.id;
    const getBooks = Database.Book.filter((book)=>book.authors.includes(authorID));
    return res.json({Books:getBooks});
});

//Route         - /author
//Description   - to get all authors
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/author",(req,res)=>{
    res.json({Authors:Database.Author})
});

//Route         - /author/:authorID
//Description   - to get specific author
//Access        - public
//Method        - GET
//Params        - authorID
//Body          - none
app.get("/author/:authorID",(req,res)=>{
    const getAuthor = Database.Author.filter((authors)=>authors.id==req.params.authorID);
    res.json({Author:getAuthor});
});

//Route         - /publication
//Description   - to get all publications
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/publication",(req,res)=>{
    res.json({Publications:Database.Publication})
});

//Route         - /publication/:publicationID
//Description   - to get specific publications
//Access        - public
//Method        - GET
//Params        - publicationID
//Body          - none
app.get("/publication/:publicationID",(req,res)=>{
    const getPublication = Database.Publication.filter((publications)=>publications.id==req.params.publicationID);
    res.json({Publication:getPublication});
});

app.listen(4000,()=>{
    console.log("Server is Running");
});