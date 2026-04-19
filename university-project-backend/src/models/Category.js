const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    hooks: {
        beforeSave: (category) => {
            if (category.name && (!category.slug || category.changed('name'))) {
                category.slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
        }
    }
})

module.exports = Category
