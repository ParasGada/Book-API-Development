const Router = require("express").Router();
const Book = require("../Schemas/Book");
const Author = require("../Schemas/Author");
const Publication = require("../Schemas/Publication");

//Route         - /publication
//Description   - to get all publications
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
Router.get("/",async (req,res)=>{
    const getPublications = await Publication.find();
    return res.json(getPublications);
});

//Route         - /publication/:publicationID
//Description   - to get specific publications
//Access        - public
//Method        - GET
//Params        - publicationID
//Body          - none
Router.get("/:publicationID",async (req,res)=>{
    const getSpecificPublication = await Publication.findOne({id:req.params.publicationID});
    if(!getSpecificPublication) return res.json({Message:`No Publication Found for ID ${req.params.publicationID}`})
    return res.json(getSpecificPublication);
});

//Route         - /publication/b/:book
//Description   - to get a list of publications based on book
//Access        - public
//Method        - GET
//Params        - book
//Body          - none
Router.get("/b/:bookID",async (req,res)=>{
    try{
        const getPublications = await Publication.find({books:req.params.bookID});
        return res.json(getPublications);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /publication/new
//Description   - to add new publication
//Access        - public
//Method        - POST
//Params        - none
//Body          - new publication data
Router.post("/new",async (req,res)=>{
    try{
        const {newPublication} = req.body;
        await Publication.create(newPublication);
        res.json({Message:"New Publication Created"});
    }catch(error){
        res.json({Error:error.message});
    }
});

//Route         - /publication/update/:id
//Description   - to update publication details
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated publication data
Router.put("/update/:id",async (req,res)=>{
    try{
        const {updatedData} = req.body;
        const updatePublication = await Publication.findOneAndUpdate(
            {id:req.params.id},
            {$set:updatedData},
            {new:true}
        );
        return res.json(updatePublication);
    }
    catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /publication/delete/:id
//Description   - to delete a specific publication
//Access        - public
//Method        - DELETE
//Params        - id
//Body          - none
Router.delete("/delete/:id",async (req,res)=>{
    const updatePublication = await Publication.findOneAndDelete({id:req.params.id});
    return res.json(updatePublication);
});

module.exports = Router;