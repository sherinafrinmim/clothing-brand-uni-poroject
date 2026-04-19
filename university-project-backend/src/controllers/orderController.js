const { Order, OrderItem, Product } = require("../models")
const { sequelize } = require('../config/db')

const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const { items, shippingAddress } = req.body

        if (!Array.isArray(items) || items.length === 0 || !shippingAddress) {
            return res.status(400).json({ message: "Items and shipping address are required" })
        }

        const productIds = items.map((item) => item.product)
        const products = await Product.findAll({
            where: { id: productIds },
            transaction
        })
        const productMap = new Map(products.map((p) => [p.id, p]))

        let totalAmount = 0
        const normalizedItems = []

        for (const item of items) {
            const product = productMap.get(item.product)
            if (!product) {
                await transaction.rollback()
                return res.status(400).json({ message: `Product not found: ${item.product}` })
            }
            if (product.stock < item.quantity) {
                await transaction.rollback()
                return res.status(400).json({ message: `Insufficient stock for: ${product.name}` })
            }

            normalizedItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            })
            totalAmount += product.price * item.quantity
        }

        // Update stock
        for (const item of normalizedItems) {
            await Product.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction
            })
        }

        const order = await Order.create({
            userId: req.user.id,
            totalAmount,
            shippingAddress
        }, { transaction })

        // Create order items
        const orderItems = normalizedItems.map(item => ({
            ...item,
            orderId: order.id
        }))
        await OrderItem.bulkCreate(orderItems, { transaction })

        await transaction.commit()

        // Fetch the complete order with items
        const completeOrder = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, attributes: ['name', 'price'] }]
            }]
        })

        return res.status(201).json(completeOrder)
    } catch (error) {
        await transaction.rollback()
        return res.status(500).json({ message: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{ model: Product, attributes: ['name', 'price'] }]
            }],
            order: [['createdAt', 'DESC']]
        })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getAllOrders = async (_req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: require('../models/User'), as: 'User', attributes: ['name', 'email'] },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, attributes: ['name', 'price'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const [updatedRowsCount] = await Order.update(
            { status: req.body.status },
            { where: { id: req.params.id }, returning: true }
        )

        if (updatedRowsCount === 0) return res.status(404).json({ message: "Order not found" })

        const updatedOrder = await Order.findByPk(req.params.id, {
            include: [
                { model: require('../models/User'), as: 'User', attributes: ['name', 'email'] },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, attributes: ['name', 'price'] }]
                }
            ]
        })
        return res.json(updatedOrder)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus }
