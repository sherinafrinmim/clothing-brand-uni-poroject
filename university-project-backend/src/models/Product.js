const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
}, {
    timestamps: true,
    hooks: {
        beforeSave: (product) => {
            if (product.name && (!product.slug || product.changed('name'))) {
                const baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                const random = Math.random().toString(36).substring(2, 6);
                product.slug = `${baseSlug}-${random}`;
            }
        }
    }
})

module.exports = Product
