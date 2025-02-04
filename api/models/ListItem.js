const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('ListItem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cost: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        purchased: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 'listitems',
        timestamps: false
    });
};