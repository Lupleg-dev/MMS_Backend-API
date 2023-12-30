const express= require("express");
const { signup, signin, forgotPassword, resetPassword, updateProfile } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin);

userRouter.post("/forgot-password", forgotPassword);

userRouter.post("/reset-password", resetPassword);

userRouter.put("/update-profile", updateProfile),

module.exports = userRouter;