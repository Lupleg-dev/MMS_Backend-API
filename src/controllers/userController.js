const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config")
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const SECRET_KEY = "NOTESAPI";

const sendResetPasswordMail = async (username, email, token) => {
    try {
      const resetPasswordLink = `http://localhost:3000/setNewPassword?token=${token}`;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
          user: config.emailUser,
          pass: config.emailPassword,
        },
      });
      const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: "for reset password",
        html: `<p> Hii 
          ${username} 
          , reset your password by clicking on the provided link <a href="${resetPasswordLink}">reset your password here</a></p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("mail has been send: - ", info.response);
        }
      });
    } catch (error) {
      return res.status(400).json({ message: "error" });
    }
  };

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        return res.status(400).json({ message: "error" });
    }
}
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: " user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        });
        res.status(201).json({ message: " User Registered Succesfully !!!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong while Registering!!!" });

    }

}

const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Old password",password);
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "invalid creantials" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY);
        res.status(201).json({ user: existingUser, token: token });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong while login!!!" });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            const randomString = randomstring.generate();
            const data = await userModel.updateOne({ email: email }, { $set: { token: randomString } });
            sendResetPasswordMail(existingUser.username, existingUser.email, randomString);
            return res.status(200).json({ message: "please check your inbox of mail and reset your password" });
        }
        else {
            return res.status(400).json({ message: "email does not exists" });
        }
    }
    catch (error) {
        res.status(404).json({ message: "something went wrong" });
    }
};

const resetPassword = async (req, res) => {
    try {
      const token = req.body.token;
      console.log(token);
      const tokenData = await userModel.findOne({ token: token });
      console.log("here is the token data ", tokenData);
      if (tokenData) {
        const password = req.body.password;
        const newPassword = await securePassword(password);
        const userData = await userModel.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: newPassword, token: "" } },
          { new: true }
        );
        res.status(200).json({ message: "user password has been reset", data: userData });
        console.log("New password",password);
      } else {
        res.status(200).json({ message: "this link has been expired" });
      }
    } catch (error) {
      res.status(400).json({ message: "something went wrong" });
    }
  };

module.exports = { signin, signup, forgotPassword, resetPassword };