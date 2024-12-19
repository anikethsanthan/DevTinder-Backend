const mongoose=require("mongoose");
const validator=require("validator");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");


const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlenght:1,
        maxlength:20,
        trim:true
    },
    lastName:{
        type:String,
        maxlength:20,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        minlength:4,
        maxlength:90,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid email address!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlenght:8,
        maxlength:120,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a valid email address!")
            }
        }
    },
    age:{
        type:Number,
        min:16,
        trim:true,
        max:150
    },
    gender:{
        type:String,
       validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender data is not valid")
        }
       },
       trim:true

    },
    about:{
        type:String,
        default:"Hello user, add some interesting facts about yourself.",
        maxlength:200,
    },
    skills:{
        type:[String],
       
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Ficon-icons.com%2Ficon%2Faccount-profile-user%2F190494&psig=AOvVaw1QFP7GOv8w6W5ZWj-bJ1Ai&ust=1734681450554000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjApp2us4oDFQAAAAAdAAAAABAp",
        trim:true,
        maxlength:250,
    }
},
{
    timestamps:true
})

userSchema.methods.validatePassword= async function(passwordEnteredByUser){
    const user=this;
    const isPasswordValid= await bcrypt.compare(passwordEnteredByUser ,user.password);
    return isPasswordValid
}

userSchema.methods.getJWT= async function () {
    const user=this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"});
    return token;
}

module.exports= mongoose.model("user",userSchema);