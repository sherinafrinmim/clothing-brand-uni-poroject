const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const { Order, OrderItem } = require('./Order')

// User associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'userId' })

// Category associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

// Product associations
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' })
OrderItem.belongsTo(Product, { foreignKey: 'productId' })

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' })
OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

module.exports = {
    User,
    Category,
    Product,
    Order,
    OrderItem,
}