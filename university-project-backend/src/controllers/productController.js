const { Product, Category } = require("../models")
const { Op } = require('sequelize')

const createProduct = async (req, res) => {
    try {
        const { name, price, category, ...rest } = req.body
        if (!name || price === undefined || !category) {
            return res.status(400).json({ message: "Name, price and category are required" })
        }

        const productData = { name, price, categoryId: category, ...rest }
        const product = await Product.create(productData)
        return res.status(201).json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getProducts = async (req, res) => {
    try {
        const { category, categoryUrl, search, minPrice, maxPrice } = req.query
        const whereClause = {}
        const categoryWhere = {}

        if (category) whereClause.categoryId = category
        if (categoryUrl) categoryWhere.slug = categoryUrl
        
        if (search) whereClause.name = { [Op.like]: `%${search}%` }
        if (minPrice || maxPrice) {
            whereClause.price = {}
            if (minPrice) whereClause.price[Op.gte] = Number(minPrice)
            if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice)
        }

        const products = await Product.findAll({
            where: whereClause,
            include: [{ 
                model: Category, 
                as: 'Category', 
                attributes: ['name', 'slug'],
                where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
                required: Object.keys(categoryWhere).length > 0
            }],
            order: [['createdAt', 'DESC']]
        })
        return res.json(products)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const isNumeric = /^\d+$/.test(id);
        
        const whereClause = isNumeric 
            ? { [Op.or]: [{ id: id }, { slug: id }] } 
            : { slug: id };

        const product = await Product.findOne({
            where: whereClause,
            include: [{ model: Category, as: 'Category', attributes: ['name', 'slug'] }]
        })
        if (!product) return res.status(404).json({ message: "Product not found" })
        return res.json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { category, ...rest } = req.body;
        const updateData = category ? { categoryId: category, ...rest } : rest;

        const [updatedRowsCount] = await Product.update(updateData, {
            where: { id: req.params.id },
            returning: true,
        })
        if (updatedRowsCount === 0) return res.status(404).json({ message: "Product not found" })

        const updatedProduct = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'Category', attributes: ['name'] }]
        })
        return res.json(updatedProduct)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const deletedRowsCount = await Product.destroy({ where: { id: req.params.id } })
        if (deletedRowsCount === 0) return res.status(404).json({ message: "Product not found" })
        return res.json({ message: "Product deleted" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
