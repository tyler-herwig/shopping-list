const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',  // Change to 'postgres'
    port: process.env.DB_PORT,
    logging: false
});

const User = require('./User')(sequelize);
const List = require('./List')(sequelize);
const ListItem = require('./ListItem')(sequelize);

// Set up associations (Postgres requires explicit definition in models)
List.associate = (models) => {
    List.hasMany(models.ListItem, { foreignKey: 'list_id', onDelete: 'CASCADE' });
};
ListItem.associate = (models) => {
    ListItem.belongsTo(models.List, { foreignKey: 'list_id' });
};

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        await sequelize.sync({ alter: true });  // Ensure schema updates
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
})();

module.exports = { sequelize, User, List, ListItem };