const express =require("express");
const {connectDb}=require("./config/database");
const User =require("./models/user");


const cookieparser=require("cookie-parser");




const app=express()
app.use(express.json());
app.use(cookieparser());

const {authRouter}=require("./routes/auth");
const{profileRouter}=require("./routes/profile")

app.use("/",authRouter);
app.use("/",profileRouter);





// app.get("/user", async(req,res)=>{
//     const userEmail= req.body.emailId;
// try{
//     const users =  await User.find({emailId:userEmail})
//     if(users.length ===0){
//         res.send("User not found");
         
//     }else{
//         res.send(users);
        
//     }
   
// }catch{
//     res.status(400).send("something went wrong");
// }

// })
// app.get("/feed", async(req,res)=>{
//     try{
//         const users= await User.find({});
//         if(!users){
//             res.status(400).send("User not found");
//         }else{
//             res.send(users);
//         }
        
//     }catch{
//         res.status(400).send("Something went wrong")
//     }
// })
// app.delete("/user", async(req,res)=>{
//     const userId= req.body.userId;
//     try{
//         await User.findByIdAndDelete(userId);
//         res.send("User deleted succesfully")
//     }catch{
//         res.status(400).send("something went wrong")
//     }
// })


connectDb().then(()=>{
    console.log("Connection established to database");
    app.listen(7777,()=>{
        console.log("Server running successfully");
    })
    
}
    ).catch(()=>{
        console.log(" unsuccessfull connection with the database")
    }
    
)





