const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { sequelize, User, List, ListItem } = require('./models');

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const generateToken = (user) => {
    return jwt.sign({ userId: user.userId, userName: user.userName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    })
}

const authenticateToken = require('./middleware/auth');

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
        res.json({ userId: user.userId, userName: user.userName, token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/api/validate-token', authenticateToken, (req, res) => {
    res.json({ message: "Token is valid!" });
});

/* -------------------------------- */

app.post('/api/lists', authenticateToken, async (req, res) => {
    const { name, description, userId } = req.body;

    try {
        const existingList = await List.findOne({ where: { name }});
        if (existingList) {
            return res.sendStatus(409);
        }

        const list = await List.create({ name, description, userId });
        res.json({ message: "List created successfully!", list});
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/api/lists', authenticateToken, async (req, res) => {
    const { userId } = req.query;

    try {
        const lists = await List.findAll({
            where: { userId },
            include: [{
                model: ListItem,
                as: 'listItems',
                attributes: [],
                required: false 
            }],
            attributes: [
                'id', 'name', 'description', 'userId',
                [sequelize.fn('COUNT', sequelize.col('listItems.id')), 'listItemCount']
            ],
            group: ['List.id'],
        });

        if (lists.length === 0) {
            return res.sendStatus(404);
        }

        res.json({ lists });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/api/lists/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const list = await List.findOne({ where: { id }});
        if (!list) {
            return res.sendStatus(404);
        }

        res.json({ list });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.put('/api/lists/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    try {
        const list = await List.findOne({ where: { id }});

        if(!list) {
            return res.sendStatus(404);
        }

        list.name = name || list.name;
        list.description = description || list.description;

        await list.save();

        res.json({ message: "List updated successfully!", list });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.delete('/api/lists/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const list = await List.findOne({ where: { id }});

        if(!list) {
            return res.sendStatus(404);
        }

        await list.destroy();

        res.json({ message: "List deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

/* -------------------------------- */

app.post('/api/list-items', authenticateToken, async (req, res) => {
    const { listId, name, description, category, cost, purchased } = req.body;

    try {
        const listItem = await ListItem.create({ listId, name, description, category, cost, purchased });
        res.json({ message: "List item created successfully!", listItem });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/api/list-items', authenticateToken, async (req, res) => {
    const { listId } = req.query;

    try {
        const listItems = await ListItem.findAll({ where: { listId }});
        if (!listItems) {
            return res.sendStatus(404);
        }

        res.json({ listItems });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/api/list-items/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const listItem = await ListItem.findOne({ where: { id }});
        if (!listItem) {
            return res.sendStatus(404);
        }

        res.json({ listItem });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.put('/api/list-items/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { name, description, category, cost, purchased } = req.body;

    try {
        const listItem = await ListItem.findOne({ where: { id }});

        if(!listItem) {
            return res.sendStatus(404);
        }

        listItem.name = name || listItem.name;
        listItem.description = description || listItem.description;
        listItem.category = category || listItem.category;
        listItem.cost = cost || listItem.cost;
        listItem.purchased = purchased || listItem.purchased;

        await listItem.save();

        res.json({ message: "Item updated successfully!", listItem });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.delete('/api/list-items/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const listItem = await ListItem.findOne({ where: { id }});

        if(!listItem) {
            return res.sendStatus(404);
        }

        await listItem.destroy();

        res.json({ message: "List item deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}`));