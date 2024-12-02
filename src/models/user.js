const mongoose=require("mongoose");
const validator=require("validator");


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
        default:"./User-photo.jpg",
        trim:true,
        maxlength:250,
    }
},
{
    timestamps:true
})


module.exports= mongoose.model("user",userSchema);