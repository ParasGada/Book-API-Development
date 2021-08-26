const Router = require("express").Router();
const Book = require("../Schemas/Book");
const Author = require("../Schemas/Author");
const Publication = require("../Schemas/Publication");

//Route         - /book
//Description   - to get all books
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
Router.get("/",async (req,res)=>{
    const getBooks = await Book.find();
    return res.json(getBooks);
});

//Route         - /book/:bookID
//Description   - to get specific books
//Access        - public
//Method        - GET
//Params        - bookID
//Body          - none
Router.get("/:bookID",async (req,res)=>{
    const getSpecificBook = await Book.findOne({ISBN:req.params.bookID});
    if(!getSpecificBook) return res.json({Message:`No Book Found for ISBN ${req.params.bookID}`});
    return res.json(getSpecificBook);
});

//Route         - /book/c/:category
//Description   - to get a list of books based on category
//Access        - public
//Method        - GET
//Params        - catergory
//Body          - none
Router.get("/c/:category",async (req,res)=>{ 
    try{
        const getBooks = await Book.find({category:req.params.category});
        return res.json(getBooks);
    }
    catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/a/:author
//Description   - to get a list of books based on author
//Access        - public
//Method        - GET
//Params        - author
//Body          - none
Router.get("/a/:author",async (req,res)=>{
    try{
        const getBooks = await Book.find({authors:parseInt(req.params.author)});
        return res.json(getBooks);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/new
//Description   - to add new book
//Access        - public
//Method        - POST
//Params        - none
//Body          - new book data
Router.post("/new",async (req,res)=>{
    try{
        const {newBook} = req.body;
        await Book.create(newBook);
        res.json({Message:"New Book Created"});
    }catch(error){
        res.json({Error:error.message});
    }
});

//Route         - /book/update/:isbn
//Description   - to update book details
//Access        - public
//Method        - PUT
//Params        - isbn
//Body          - updated book data
Router.put("/update/:isbn",async (req,res)=>{
    try{
        const {updatedData} = req.body;
        const updatedBook = await Book.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {$set:updatedData},
        {new:true}
        );
        return res.json(updatedBook);
    }
    catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/updateAuthor/:isbn
//Description   - to update/add new author to book
//Access        - public
//Method        - PUT
//Params        - isbn
//Body          - updated author/book data
Router.put("/updateAuthor/:isbn",async (req,res)=>{
    try{
        const {newAuthor} = req.body;
        const {isbn} = req.params;
        const updateBook= await Book.findOneAndUpdate(
            {ISBN:isbn},
            {$addToSet:{
                authors:newAuthor
            }},
        {new:true}
        );
            const updateAuthor= await Author.findOneAndUpdate(
                {id:newAuthor},
                {$addToSet:{
                    books:isbn
                }},
                {new:true}
            );
        return res.json({Books:updateBook,Authors:updateAuthor});
    }
    catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/updatePublication/:isbn
//Description   - to update/add book to publications
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated book data
Router.put("/updatePublication/:ID",async (req,res)=>{
    try{
        const {newBook} = req.body;
        const {ID} = req.params;
        const updatePublication = await Publication.findOneAndUpdate(
            {id:parseInt(ID)},
            {$addToSet:{
                books:newBook
            }},
            {new:true}
        );
    return res.json(updatePublication);
    }
    catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/delete/:isbn
//Description   - to delete a specific book
//Access        - public
//Method        - DELETE
//Params        - isbn
//Body          - none
Router.delete("/delete/:isbn",async (req,res)=>{
    const {isbn} = req.params;
    const updateBook = await Book.findOneAndDelete({ISBN:isbn});
    const updateAuthor = await Author.updateMany(
        {books:isbn},
        {$pull:{
            books:isbn
        }},
        {new:true}
    );
    const updatePublication = await Publication.updateMany(
        {books:isbn},
        {$pull:{
            books:isbn
        }},
        {new:true}
    );
    return res.json({Books:updateBook,Authors:updateAuthor,Publications:updatePublication});
});

//Route         - /book/delete/author/:isbn/:id
//Description   - to delete a author from a book
//Access        - public
//Method        - DELETE
//Params        - isbn,id
//Body          - none
Router.delete("/delete/author/:isbn/:id",async (req,res)=>{
    const {isbn,id} = req.params;
    const updateBook = await Book.findOneAndUpdate(
        {ISBN:isbn},
        {$pull:{
            authors:parseInt(id)
        }},
        {new:true}        
    );
    const updateAuthor = await Author.findOneAndUpdate(
        {id:parseInt(id)},
        {$pull:{
            books:isbn
        }},
        {new:true}
    );
    return res.json({Book:updateBook,Author:updateAuthor});
});

//Route         - /book/delete/publication/:isbn/:id
//Description   - to delete a publication from a book and book from publication
//Access        - public
//Method        - DELETE
//Params        - isbn,id
//Body          - none
Router.delete("/delete/publication/:isbn/:id",async (req,res)=>{
    const {isbn,id} = req.params;
    const updateBook = await Book.findOneAndUpdate(
        {ISBN:isbn},
        {$set:{
            publication:0
        }},
        {new:true}        
    );
    const updatePublication = await Publication.findOneAndUpdate(
        {id:parseInt(id)},
        {$pull:{
            books:isbn
        }},
        {new:true}
    );
    return res.json({Book:updateBook,Publication:updatePublication});
});

module.exports = Router;