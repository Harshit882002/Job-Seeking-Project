import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must contain at least 3 characters !"],
        maxLength: [20, "Name can't exceed 20 characters ! "],
    },
    email: {
        type: String,
        required: [true, "Please provide your email ! "],
        validate: [validator.isEmail, "Please provide a valid email ! "]

    },
    phone:{
        type: Number,
        required: [true, "Please provide your Mobile Number"]
    },
    password: {
        type: String,
        required: [true, "Please provide your Password"],
        minLength: [5, "Password must contain at least 5 characters !"],
        maxLength: [15, "Password can't exceed 15 characters ! "],
    },
    role:{
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// Hasing the password

//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing password

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

// Genrating a JWT Token for authorization

//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH.

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);

