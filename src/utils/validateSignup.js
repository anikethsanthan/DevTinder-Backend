const validator=require("validator");

const validateSignup=(req)=>{
const {firstName, lastName, emailId, password}=req.body;
try{
    if(!firstName||!lastName){
        throw new Error("Name is a required field to proceed")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email id")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error(" Weak password ! Please try a strong password")
    }
}catch(err){
    throw new Error("Error in validation process")
}

}

const validateEditRequest =(req)=>{
    const allowedUpdates=["firstName","lastName","gender","about","skills","photoUrl"];
    const iseditAllowed = Object.keys(req.body).every((field)=>allowedUpdates.includes(field));
    return iseditAllowed;
}




module.exports={validateSignup, validateEditRequest}