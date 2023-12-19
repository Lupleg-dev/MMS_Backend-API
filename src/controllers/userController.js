const userModel= require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const signup = async (req,res)=>{
//existing user check
//hashed password
//user creation
//token generation
    const {username, email, password} = req.body;
    try{
        const existingUser = await userModel.findOne({ email : email});
        if(existingUser){
            return res.status(400).json({message:  " user already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const result = await userModel.create({
            email:email,
            password:hashedPassword,
            username: username
        });

        const token = jwt.sign({email : result.email, id : result._id}, SECRET_KEY);
        res.status(201).json({user: result, token: token});

    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }
}

const signin = async (req,res)=>{
    const {email, password} = req.body;
    try{
        const existingUser = await userModel.findOne({email: email});
        if(!existingUser){
            return res.status(404).json({message:"user not found"});
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(400).json({message:"invalid creantials"});
        }
        const token = jwt.sign({email : existingUser.email, id : existingUser._id}, SECRET_KEY);
        res.status(201).json({user: existingUser, token: token});
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }
}

module.exports= {signin, signup};