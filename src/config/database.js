const mongoose =require("mongoose");


const connectDb =async()=>{
    await mongoose.connect(
        "mongodb+srv://anikethsanthan:ufCEqylT7AHzwpvl@devtinder.k0nee.mongodb.net/DevTinder"
    );
}

module.exports={connectDb}
