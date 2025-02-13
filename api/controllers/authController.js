const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
    return jwt.sign({ userId: user.userId, userName: user.userName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

// Register User
exports.registerUser = async (req, res) => {
    const { userName, password, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ where: { userName } });
        if (existingUser) return res.sendStatus(409);

        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`;
        await User.create({ userName, password: hashedPassword, fullName, firstName, lastName });

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await User.findOne({ where: { userName } });
        if (!user) return res.sendStatus(404);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Password incorrect!');

        const token = generateToken(user);
        res.json({ userId: user.userId, userName: user.userName, fullName: user.fullName, firstName: user.firstName, lastName: user.lastName, token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};