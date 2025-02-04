const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('./models');

const app = express();
app.use(express.json());

const generateToken = (user) => {
    return jwt.sign({ userId: user.userId, userName: user.userName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    })
}

// User registration endpoint
app.post('/api/user', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { userName } });
        if (existingUser) {
            return res.sendStatus(409);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ userName, password: hashedPassword });
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await User.findOne({ where: { userName } });
        if (!user) {
            return res.sendStatus(404);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Password incorrect!');
        }
        
        const token = generateToken(user);
        res.json({ message: `${userName} is logged in!`, token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}`));