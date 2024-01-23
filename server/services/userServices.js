const userModel = require("../models/userModel.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secreteKey = "Flipzone2023";
const cookieParser=require('cookie-parser');
const refreshTokenSecretKey="refreshTokenFlipzone2023";

const setCookieParser=(app)=>{
      app.use(cookieParser());
}

const generateAccessToken=(user)=>{
    return jwt.sign({UserID:user._id,email:user.email}, secreteKey,{expiresIn:"24h"});
}

const generateRefreshToken=(user)=>{
    return jwt.sign({UserID:user._id,email:user.email}, refreshTokenSecretKey,{expiresIn:"30d"});
}

const setTokenCookies=(res,accessToken, refreshToken)=>{
    res.cookie('accessToken',accessToken,{httpOnly:true});
    res.cookie('refreshToken',refreshToken,{httpOnly:true});

}

const clearTokenCookies=(res)=>{
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

}
const UserRegistration = async (req, resp) => {
    try {
        console.log("Registration process started");
        const { username, email, password } = req.body;
        console.log("Received user data:", req.body);

        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            console.log("User already exists");
            return resp.send({ "status": "failed", "message": "User already exists" });
        }

        if (username && password && email) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new userModel({
                    username: username,
                    email: email,
                    password: hashedPassword
                });

                await newUser.save();

                const savedUser = await userModel.findOne({ email: email });
                const accessToken = generateAccessToken(savedUser);
                const refreshToken = generateRefreshToken(savedUser);
                setTokenCookies(resp,accessToken,refreshToken);

                console.log("Registration successful");
                return resp.status(201).send({ "status": "success", "message": "Registered successfully", "accessToken": accessToken, "refreshToken":refreshToken });
            } catch (error) {
                console.error("Error during registration:", error);
                return resp.send({ "status": "failed", "message": "Error during registration" });
            }
        } else {
            console.log("All fields are required");
            return resp.send({ "status": "failed", "message": "All fields are required" });
        }

    } catch (error) {
        console.error("Unable to register:", error);
        return resp.send({ "status": "failed", "message": "Unable to register" });
    }
}

const userLogin = async (req, resp) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await userModel.findOne({ email: email });
        if (!user) {
            console.log("Invalid Email");
            return resp.status(401).send({ "status": "Failed", "message": "Invalid email" });
        }
        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return resp.status(401).send({ "status": "Failed", "message": "Invalid password" })
            }
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            setTokenCookies(resp,accessToken,refreshToken);

            console.log("logged in successfully");
            return resp.json({ accessToken, refreshToken });
        }
        catch (error) {
            console.log("Error During logging", error);
            return resp.status(401).send({ "status": "Failed", "message": "Error During Logging..." });
        }
    }
    catch (error) {
        console.log("Unable to logging", error);
        return resp.status(401).send({ "status": "Failed", "message": "Unable to Logging..." });
    }
}

const userLogout = async (req, resp) => {
    try{
        clearTokenCookies(resp);
        return resp.json({"status":"Successful","message":"Logout successful"});
    }
    catch(error){
        return resp.json({"status": "Failed", "message": "Unable to Logout..."})
    }
}

module.exports = {
    setCookieParser,
    UserRegistration,
    userLogin,
    userLogout
};
