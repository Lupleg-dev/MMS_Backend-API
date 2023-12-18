const express= require("express");
const userRouter = express.Router();

userRouter.post("/signup",(req,res)=>{
    res.send("Signup");
});

userRouter.post("/signin", (req,res)=>{
    res.send("Signin");
});

module.exports = userRouter;