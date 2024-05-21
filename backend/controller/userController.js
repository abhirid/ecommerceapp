import { userModel } from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

//login user
const loginUser= async (req,res) => {
    // Implementation for login user function
    const {email,password} = req.body;
    try {
        const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({success:false,msg:"User does not exist"}) // Changed "User does not exist" to "User does not exist"
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({success:false,msg:"Invalid credential"}) // Changed "Incorrect password" to "Incorrect password"
    }
    const token=createToken(user._id);
    res.status(200).json({success:true,token})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,msg:"Server error"}) // Changed "Server error" to "Server error"
        
    }
    
}

//creating token
const createToken= (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req,res) => {
   const {name,password,email}=req.body;
   try {
    //checking if user already exists
    const exist=await userModel.findOne({email});
    if(exist){
        return res.status(400).json({success:false,msg:"User already exists"}) // Changed "User already exist" to "User already exists"
    }
    //validating email format & strong password
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,msg:"Please enter a valid email"}) // Changed "Please enter valid email" to "Please enter a valid email"
    }
    if (password.length < 8) {
        return res.status(400).json({success:false,msg:"Password must be atleast 8 characters"}) // Changed "Password must be atleast 8 characters" to "Password must be atleast 8 characters"
    }
    //hashing user password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    //creating new user
    const newUser=new userModel({
        name,
        email,
        password:  hashedPassword
    })
    const user= await newUser.save();
    const token=createToken(user._id)
    res.status(201).json({success:true,token})
   } catch (error) {
     console.log(error)
     res.status(500).json({success:false,msg:"Error"})
   }
} 

export {loginUser, registerUser}
