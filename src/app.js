const express =require("express");
const {connectDb}=require("./config/database");
const User =require("./models/user");


const app=express()

app.post("/signup",async (req,res)=>{
    const user= new User({
        firstName:"Virat",
        lastName:"Kohli",
        emailId:"Virat@213",
        password:"virat@123",
        age:45,
    })
  
try{
    await user.save();
    res.send("User added succesfully");
}catch{
    res.status(400).send("Unsuccesfull request");
}

    
})
connectDb().then(()=>{
    console.log("Connection established to database");
    app.listen(7777,()=>{
        console.log("Server running successfully");
    })
    
}
    ).catch(()=>{
        console.log("Connection was unsuccessfull with the database")
    }
    
)





