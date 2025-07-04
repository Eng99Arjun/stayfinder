
import User from '../models/User.js'
import jwt from 'jsonwebtoken';

export const registerUser = async(req, res) => {
    const { name, email, password, isHost } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const user = await User.create({ name, email, password, isHost });

        if(user){
            res.status(201).json({
                id:user._id,
                name: user.name,
                email:user.email,
                isHost: user.isHost,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(user && ( await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isHost: user.isHost,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({
                message: 'Invalid Credentials'
            })
        }

    } catch (error) {
        res.status(400).json({ message: 'Invalid request'});
    }
}


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
};

