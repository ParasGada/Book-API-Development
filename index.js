const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.json({message:"Request Served"});
});

app.listen(4000,()=>{
    console.log("Server is Running");
});