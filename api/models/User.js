const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,  // This will map to PostgreSQL's SERIAL
            autoIncrement: true,
            primaryKey: true
        },
        user_name: {
            type: DataTypes.STRING(45),  // Define length explicitly for performance
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),  // Define length explicitly for performance
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING(250),  // Define length explicitly for performance
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(50),  // Define length explicitly for performance
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(200),  // Define length explicitly for performance
            allowNull: false
        }
    }, {
        schema: 'listify',
        tableName: 'users',
        timestamps: false
    });
};