const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
    return jwt.sign({ user_id: user.user_id, user_name: user.user_name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

// Register User
exports.registerUser = async (req, res) => {
    const { user_name, password, first_name, last_name } = req.body;
    try {
        const existingUser = await User.findOne({ where: { user_name } });
        if (existingUser) {
            return res.status(409).json({
                error: "This username is already taken. Please choose a different one."
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const full_name = `${first_name} ${last_name}`;
        await User.create({ user_name, password: hashedPassword, full_name, first_name, last_name });

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { user_name, password } = req.body;
    try {
        const user = await User.findOne({ where: { user_name } });
        if (!user) {
            return res.status(404).json({
                error: "Invalid username or password. Please try again."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid username or password. Please try again."
            });
        }

        const token = generateToken(user);
        res.json({ user_id: user.user_id, user_name: user.user_name, full_name: user.full_name, first_name: user.first_name, last_name: user.last_name, token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};