const Router = require("express").Router();
const Book = require("../Schemas/Book");
const Author = require("../Schemas/Author");
const Publication = require("../Schemas/Publication");

//Route         - /author
//Description   - to get all authors
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
Router.get("/",async (req,res)=>{
    const getAuthors = await Author.find();
    return res.json(getAuthors);
});

//Route         - /author/:authorID
//Description   - to get specific author
//Access        - public
//Method        - GET
//Params        - authorID
//Body          - none
Router.get("/:authorID",async (req,res)=>{
    const getSpecificAuthor = await Author.findOne({id:req.params.authorID});
    if(!getSpecificAuthor) return res.json({Message:`No Author Found for ID ${req.params.authorID}`});
    return res.json(getSpecificAuthor);
});

//Route         - /author/b/:book
//Description   - to get a list of authors based on book
//Access        - public
//Method        - GET
//Params        - book 
//Body          - none
Router.get("/b/:bookID",async (req,res)=>{
    try{
        const getAuthors = await Author.find({books:req.params.bookID});
        return res.json(getAuthors);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /author/new
//Description   - to add new author
//Access        - public
//Method        - POST
//Params        - none
//Body          - new author data
Router.post("/new",async (req,res)=>{
    try{
        const {newAuthor} = req.body;
        await Author.create(newAuthor);
        res.json({Message:"New Author Created"});
    }catch(error){
        res.json({Error:error.message});
    }
});

//Route         - /author/update/:id
//Description   - to update author details
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated author data
Router.put("/update/:id",async (req,res)=>{
    try{
        const {updatedData} = req.body;
        const updateAuthor = await Author.findOneAndUpdate(
        {id:req.params.id},
        {$set:updatedData},
        {new:true}
    );
    return res.json(updateAuthor);
    }
    catch(error)
    {
        return res.json({Error:error.message});
    }
});

//Route         - /author/delete/:id
//Description   - to delete a specific author
//Access        - public
//Method        - DELETE
//Params        - id
//Body          - none
Router.delete("/delete/:id",async (req,res)=>{
    const {id} = req.params;
    const updateAuthor = await Author.findOneAndDelete({id:req.params.id});
    const updatedBook = await Book.updateMany(
        {authors:parseInt(id)},
        {$pull:{
            authors:parseInt(id)
        }},
        {new:true}
    );
    return res.json({Authors:updateAuthor,Books:updatedBook});
});

module.exports = Router;