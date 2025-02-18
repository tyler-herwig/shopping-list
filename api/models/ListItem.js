const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ListItem = sequelize.define('ListItem', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING, // Updated from INTEGER to STRING
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cost: {
            type: DataTypes.DECIMAL(9, 2),
            allowNull: true
        },
        purchased: {
            type: DataTypes.BOOLEAN, // Updated from INTEGER to BOOLEAN
            allowNull: true
        }
    }, {
        schema: 'listify',
        tableName: 'listitems',
        timestamps: false
    });

    ListItem.associate = (models) => {
        ListItem.belongsTo(models.List, {
            foreignKey: 'list_id',
            as: 'lists'
        });
    };

    return ListItem;
};