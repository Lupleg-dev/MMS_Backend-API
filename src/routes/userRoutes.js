const express= require("express");
const { signup, signin, forgotPassword, resetPassword } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password", resetPassword);

module.exports = userRouter;