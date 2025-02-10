const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const List = sequelize.define('List', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'lists',
        timestamps: false
    });
    
    List.associate = (models) => {
        List.hasMany(models.ListItem, {
            foreignKey: 'listId',
            as: 'listItems'
        });
    };

    return List;
};