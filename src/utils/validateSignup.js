const validator=require("validator");

const validateSignup=(req)=>{
const {firstName, lastName, emailId, password}=req.body;

if(!firstName||!lastName){
    throw new Error("Name is a required field to proceed")
}
if(!validator.isEmail(emailId)){
    throw new Error("Enter a valid email id")
}
if(!validator.isStrongPassword(password)){
    throw new Error(" Weak password ! Please try a strong password")
}
}

module.exports={validateSignup}