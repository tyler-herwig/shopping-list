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
            allowNull: false,
            validate: {
                notEmpty: { msg: "Name cannot be empty." },
                len: { args: [1, 100], msg: "Name must be between 1 and 100 characters." }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [0, 500], msg: "Description must be less than 500 characters." }
            }
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
            as: 'listItems',
            onDelete: 'CASCADE'
        });
    };

    return List;
};