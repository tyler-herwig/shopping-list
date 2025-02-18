const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const listItemRoutes = require('./routes/listItemRoutes');

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', authRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/list-items', listItemRoutes);

// Sync Sequelize with PostgreSQL
sequelize.sync({ alter: true }) // Automatically adjusts tables if needed
    .then(() => console.log("PostgreSQL Database connected & synced"))
    .catch(err => console.error("Error connecting to database:", err));

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}`));