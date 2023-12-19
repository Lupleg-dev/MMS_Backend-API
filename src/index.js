require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");

const mongoose = require("mongoose");

app.use(express.json());

app.use((req,res,next)=>{
    console.log("HTTP Method - " + req.method + " , URL - " + req.url);
    next();
});

app.use("/users",userRouter);

app.get("/",(req,res)=>{
    res.send("hello");
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started on port no." + PORT);
    });
})
.catch((error)=>{
    console.log(error);
})


