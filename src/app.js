const express =require("express");
const {connectDb}=require("./config/database");
const User =require("./models/user");
const dotenv=require("dotenv");
dotenv.config();


const cookieparser=require("cookie-parser");
const cors=require("cors");




const app=express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieparser());

const {authRouter}=require("./routes/auth");
const{profileRouter}=require("./routes/profile")
const{requestRouter}=require("./routes/request")
const {userFeedRouter}= require("./routes/userFeed")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userFeedRouter);



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





