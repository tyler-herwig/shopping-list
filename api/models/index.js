const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false
});

const User = require('./User')(sequelize);
const List = require('./List')(sequelize);
const ListItem = require('./ListItem')(sequelize);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

module.exports = { sequelize, User, List, ListItem };