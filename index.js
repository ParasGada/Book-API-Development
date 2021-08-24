require("dotenv").config();

const express = require("express");

const Database = require("./database");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(()=>console.log("Connection Established")).catch((error)=>console.log(error));

const app = express();

app.use(express.json());

const Book = require("./Schemas/Book");
const Author = require("./Schemas/Author");
const Publication = require("./Schemas/Publication");

app.get("/",(req,res)=>{
    return res.json({message:"Request Served"});
});

//Route         - /book
//Description   - to get all books
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/book",async (req,res)=>{
    const getBooks = await Book.find();
    return res.json(getBooks);
});

//Route         - /book/:bookID
//Description   - to get specific books
//Access        - public
//Method        - GET
//Params        - bookID
//Body          - none
app.get("/book/:bookID",async (req,res)=>{
    const getSpecificBook = await Book.findOne({ISBN:req.params.bookID});
    return res.json(getSpecificBook);
});

//Route         - /book/c/:category
//Description   - to get a list of books based on category
//Access        - public
//Method        - GET
//Params        - catergory
//Body          - none
app.get("/book/c/:category",async (req,res)=>{ 
    try{
        const getBooks = await Book.find();
        const filtered = getBooks.filter((book)=>book.category.includes(req.params.category));
        return res.json(filtered);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /book/a/:author
//Description   - to get a list of books based on author
//Access        - public
//Method        - GET
//Params        - author
//Body          - none
app.get("/book/a/:author",async (req,res)=>{
    try{
        const getBooks = await Book.find();
        const filtered = getBooks.filter((book)=>book.authors.includes(req.params.author));
        return res.json(filtered);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /author
//Description   - to get all authors
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/author",async (req,res)=>{
    const getAuthors = await Author.find();
    return res.json(getAuthors);
});

//Route         - /author/:authorID
//Description   - to get specific author
//Access        - public
//Method        - GET
//Params        - authorID
//Body          - none
app.get("/author/:authorID",async (req,res)=>{
    const getSpecificAuthor = await Author.findOne({id:req.params.authorID});
    return res.json(getSpecificAuthor);
});

//Route         - /author/b/:book
//Description   - to get a list of authors based on book
//Access        - public
//Method        - GET
//Params        - book 
//Body          - none
app.get("/author/b/:bookID",async (req,res)=>{
    try{
        const getAuthors = await Author.find();
        const filtered = getAuthors.filter((author)=>author.books.includes(req.params.bookID));
        return res.json(filtered);
    }catch(error){
        return res.json({Error:error.message});
    }
});

//Route         - /publication
//Description   - to get all publications
//Access        - public
//Method        - GET
//Params        - none
//Body          - none
app.get("/publication",async (req,res)=>{
    const getPublications = await Publication.find();
    return res.json(getPublications);
});

//Route         - /publication/:publicationID
//Description   - to get specific publications
//Access        - public
//Method        - GET
//Params        - publicationID
//Body          - none
app.get("/publication/:publicationID",async (req,res)=>{
    const getSpecificPublication = await Publication.findOne({id:req.params.publicationID});
    return res.json(getSpecificPublication);
});

//Route         - /publication/b/:book
//Description   - to get a list of publications based on book
//Access        - public
//Method        - GET
//Params        - book
//Body          - none
app.get("/publication/b/:bookID",async (req,res)=>{
    try{
        const getPublications = await Publication.find();
        const filtered = getPublications.filter((pub)=>pub.books.includes(req.params.bookID));
        return res.json(filtered);
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
app.post("/book/new",async (req,res)=>{
    try{
        const {newBook} = req.body;
        await Book.create(newBook);
        res.json({Message:"New Book Created"});
    }catch(error){
        res.json({Error:error.message});
    }
});

//Route         - /author/new
//Description   - to add new author
//Access        - public
//Method        - POST
//Params        - none
//Body          - new author data
app.post("/author/new",async (req,res)=>{
    try{
        const {newAuthor} = req.body;
        await Author.create(newAuthor);
        res.json({Message:"New Author Created"});
    }catch(error){
        res.json({Error:error.message});
    }
});

//Route         - /publication/new
//Description   - to add new publication
//Access        - public
//Method        - POST
//Params        - none
//Body          - new publication data
app.post("/publication/new",async (req,res)=>{
    try{
        const {newPublication} = req.body;
        await Publication.create(newPublication);
        res.json({Message:"New Publication Created"});
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
app.put("/book/update/:isbn",(req,res)=>{
    const {updatedBook} = req.body;
    const updateData = Database.Book.map((book)=>{
        if(book.ISBN===req.params.isbn) return {...book,...updatedBook}
        else return book;
    });
    Database.Book = updateData;
    res.json(Database.Book);
});

//Route         - /bookAuthor/update/:isbn
//Description   - to update/add new author to book
//Access        - public
//Method        - PUT
//Params        - isbn
//Body          - updated author/book data
app.put("/bookAuthor/update/:isbn",(req,res)=>{
    const {newAuthor} = req.body;
    const {isbn} = req.params;
    const updateBook= Database.Book.map((book)=>{
        if(book.ISBN===isbn){
            if(!book.authors.includes(newAuthor)){
                book.authors.push(newAuthor);
            }
            else return book;
        }
        return book;
    });
    const updateAuthor= Database.Author.map((author)=>{
        if(author.id===newAuthor){
            if(!author.books.includes(isbn)){
                author.books.push(isbn);
            }
            else return author;
        }
        return author;
    });
    console.log(updateBook,updateAuthor);
    return res.json({Books:updateBook});
});

//Route         - /author/update/:id
//Description   - to update author details
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated author data
app.put("/author/update/:id",(req,res)=>{
    const {updatedAuthor} = req.body;
    const updateData = Database.Author.map((author)=>{
        if(author.id===parseInt(req.params.id)) {
            return {...author,...updatedAuthor};}
        else return author;
    });
    Database.Author = updateData;
    res.json(Database.Author);
});

//Route         - /publication/update/:id
//Description   - to update publication details
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated publication data
app.put("/publication/update/:id",(req,res)=>{
    const {updatedPublication} = req.body;
    const updateData = Database.Publication.map((pub)=>{
        if(pub.id===parseInt(req.params.id)) {
            return {...pub,...updatedPublication};}
        else return pub;
    });
    Database.Publication = updateData;
    res.json(Database.Publication);
});

//Route         - /bookPublication/update/:isbn
//Description   - to update/add book to publications
//Access        - public
//Method        - PUT
//Params        - id
//Body          - updated book data
app.put("/bookPublication/update/:id",(req,res)=>{
    const {newBook} = req.body;
    const {id} = req.params;
    const updatePublication= Database.Publication.map((publication)=>{
        if(publication.id===parseInt(id)){
            if(!publication.books.includes(newBook)){
                publication.books.push(newBook);
            }
            else return publication;
        }
        return publication;
    });
    return res.json({Publications:updatePublication});
});

//Route         - /book/delete/:isbn
//Description   - to delete a specific book
//Access        - public
//Method        - DELETE
//Params        - isbn
//Body          - none
app.delete("/book/delete/:isbn",(req,res)=>{
    const {isbn} = req.params;
    Database.Book = Database.Book.filter((book)=>book.ISBN!==isbn);
    Database.Author.map((author)=>{
        if(!author.books.includes(isbn)){
            return author;
        }
        author.books = author.books.filter((book)=>book!==isbn);
        return author;
    });
    Database.Publication.map((pub)=>{
        if(!pub.books.includes(isbn)){
            return pub;
        }
        pub.books = pub.books.filter((book)=>book!==isbn);
        return pub;
    });
    return res.json({Database:Database});
});

//Route         - /book/delete/author/:isbn/:id
//Description   - to delete a author from a book
//Access        - public
//Method        - DELETE
//Params        - isbn,id
//Body          - none
app.delete("/book/delete/author/:isbn/:id",(req,res)=>{
    const {isbn,id} = req.params;
    Database.Book.map((book)=>{
        if(book.ISBN===isbn){
            if(!book.authors.includes(parseInt(id))){
                return book;
            }
            book.authors = book.authors.filter((ID)=>ID!==parseInt(id));
            return book;
        }
        return book;
    });

    Database.Author.map((author)=>{
        if(author.id===parseInt(id)){
            if(!author.books.includes(isbn)){
                return author;
            }
            author.books = author.books.filter((book)=>book!==isbn);
            return author;
        }
        return author;
    });
    return res.json({Database:Database});
});

//Route         - /author/delete/:id
//Description   - to delete a specific author
//Access        - public
//Method        - DELETE
//Params        - id
//Body          - none
app.delete("/author/delete/:id",(req,res)=>{
    const {id} = req.params;
    Database.Author = Database.Author.filter((author)=>author.id!==parseInt(id));
    Database.Book.map((book)=>{
        if(!book.authors.includes(parseInt(id))){
            return book;
        }
        book.authors = book.authors.filter((author)=>author!==parseInt(id));
        return book;
    });
    return res.json({Database:Database});
});

//Route         - /publication/delete/:id
//Description   - to delete a specific publication
//Access        - public
//Method        - DELETE
//Params        - id
//Body          - none
app.delete("/publication/delete/:id",(req,res)=>{
    const {id} = req.params;
    Database.Publication = Database.Publication.filter((pub)=>pub.id!==parseInt(id));
    return res.json({Database:Database});
});

//Route         - /book/delete/publication/:isbn/:id
//Description   - to delete a publication from a book and book from publication
//Access        - public
//Method        - DELETE
//Params        - isbn,id
//Body          - none
app.delete("/book/delete/publication/:isbn/:id",(req,res)=>{
    const {isbn,id} = req.params;
    Database.Book.map((book)=>{
        if(book.ISBN===isbn){
           book.publication = book.publication - 1;
        }
        return book;
    });

    Database.Publication.map((pub)=>{
        if(pub.id===parseInt(id)){
            if(!pub.books.includes(isbn)){
                return pub;
            }
            pub.books = pub.books.filter((book)=>book!==isbn);
            return pub;
        }
        return pub;
    });
    return res.json({Database:Database});
});

app.listen(4000,()=>{
    console.log("Server is Running");
});