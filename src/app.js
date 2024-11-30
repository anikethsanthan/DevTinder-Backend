const express =require("express");


const app=express()

app.use("/test",(req,res)=>{
    res.send("Ye hai testing page");
})
app.use("/",(req,res)=>{
    res.send("Hello Paji successful setup ")
})



app.listen(7777,()=>{
    console.log("Server running successfully");
})