const userModel= require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a token for password reset
        const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, { expiresIn: "1h" });

        // Send email with the reset link
        const resetLink = `http://localhost:3000/users/forgot-password?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kkashish428@gmail.com",
                pass: "kkashish1",
            },
        });

        const mailOptions = {
            from: "kkashish428@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Failed to send reset email" });
            }
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Reset email sent successfully" });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const resetPassword = async (req, res) => {
    // Implement the logic to reset the password using the token
    // Extract token from request and verify it using jwt.verify
    // If valid, update the user's password in the database
    // Respond with success or error message accordingly
};

module.exports= {signin, signup, forgotPassword, resetPassword};