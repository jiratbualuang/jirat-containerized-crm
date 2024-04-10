import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { UserSchema } from "../models/userModel.js";

const User = mongoose.model('User', UserSchema);

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized users!'})
    }
}

export const register = async (req, res) => {
    try {
        const saltRounds = 10;
        const newUser = new User(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        newUser.hashPassword = hashedPassword;
        const savedUser = await newUser.save();
        return res.json(savedUser);
    } catch (err) {
        return res.status(400).send({
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // if (!user) {
        //     return res.status(401).json({ message: 'Authentication failed. No user found' });
        // }
        // if (!user.comparePassword(req.body.password, user.hashPassword)) {
        //     return res.status(401).json({ message: 'Authentication failed. Wrong password' });
        // }
        const token = jwt.sign({ email: user.email, username: user.username, _id: user.id }, 'RESTFULAPIs');
        return res.json({ token });
    } catch (err) {
        return res.status(500).send({ message: 'Internal server error' });
    }
};