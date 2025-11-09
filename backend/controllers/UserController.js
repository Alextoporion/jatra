const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const createStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const profileImage = req.file?.path || null;
        const hashedPassword = await bcrypt.hash(String(password), 10);
        const newUser = new UserModel({
            ...req.body,
            password: hashedPassword,
            profileImage,
        })
        await newUser.save();
        res.status(201).json({ message: "Staff created successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const getAllStaff = async (req, res) => {
    try {
        const staffs = await UserModel.find()
        res.status(200).json({
            success: true,
            message: "successfully fetched all staffs",
            data: staffs
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const loggingInStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const jwtToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" });
            res.status(200).json({success:true,
            message: "Login successful",
            jwtToken,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
            })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
module.exports = { createStaff, getAllStaff, loggingInStaff };