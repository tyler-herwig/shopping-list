const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ListItem = sequelize.define('ListItem', {
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
            type: DataTypes.DECIMAL(9,2),
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

    ListItem.associate = (models) => {
        ListItem.belongsTo(models.List, {
            foreignKey: 'listId',
            as: 'list'
        });
    };

    return ListItem;
};