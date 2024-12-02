const express =require("express");
const {connectDb}=require("./config/database");
const User =require("./models/user");
const validator =require("validator");
const {validateSignup} =require("./utils/validateSignup");
const bcrypt=require("bcrypt");
const cookieparser=require("cookie-parser");
const jwt= require("jsonwebtoken");


const app=express()
app.use(express.json());
app.use(cookieparser());


app.post("/signup",async (req,res)=>{  
try{
    validateSignup(req);
    const {firstName, lastName, emailId, password}=req.body;

    const passwordHash=await bcrypt.hash(password,10);
    const user= new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    })
    await user.save();
    res.send("User added succesfully");
}catch(err){
    res.status(400).send("ERROR :"+" "+err.message);
}
   
})
app.post("/login", async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const token= await jwt.sign({_id:user._id},"DEV@Tinder$790");
        const isPasswordValid= await bcrypt.compare(password ,user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }else{
            res.cookie("token",token)
            res.send("Login Succesfull")
        }
       
        

    }catch(err){
        res.send("Error:"+ " "+err.message); 
    }
})
app.get("/profile",async(req,res)=>{
    try{
        const cookies= req.cookies;
        const{token}=cookies;
        if(!token){
            throw new Error("Invalid token")
        }
        const decodedmessage= await jwt.verify(token,"DEV@Tinder$790");
        const{_id}=decodedmessage;
        const user =await User.findById(_id);
        if(!user){
            throw new Error("User not found")
        }
        res.send(user)

    }catch(err){
        throw new Error("Error"+ err.message)
    }
})
app.get("/user", async(req,res)=>{
    const userEmail= req.body.emailId;
try{
    const users =  await User.find({emailId:userEmail})
    if(users.length ===0){
        res.send("User not found");
         
    }else{
        res.send(users);
        
    }
   
}catch{
    res.status(400).send("something went wrong");
}

})
app.get("/feed", async(req,res)=>{
    try{
        const users= await User.find({});
        if(!users){
            res.status(400).send("User not found");
        }else{
            res.send(users);
        }
        
    }catch{
        res.status(400).send("Something went wrong")
    }
})
app.delete("/user", async(req,res)=>{
    const userId= req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted succesfully")
    }catch{
        res.status(400).send("something went wrong")
    }
})
app.patch("/user/:userId",async(req,res)=>{
    const userId= req.params?.userId;
    const data= req.body;
    try{
        const allowedUpdates=["firstName","lastName","password","gender","about","skills","photoUrl"];
        const isUpdateAllowed= Object.keys(data).every((k)=> allowedUpdates.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Updation of this field is not allowed")
        }
        if(data.skills && data.skills.length > 10){
            throw new Error("You can only add upto 10 skills")
        }
        if(data.photoUrl && !validator.isURL(data.photoUrl)){
            throw new Error ("Enter a valid photo URL")
        }

        await User.findByIdAndUpdate(userId, data ,{runValidators:true});
        res.send("User updated succesfully");
    }catch(err){
        res.send("something went wrong"+ " "+err.message);
    }
})


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





