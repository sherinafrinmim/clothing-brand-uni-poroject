const { Category, Product } = require("../models")

const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body
        if (!name) return res.status(400).json({ message: "Category name is required" })

        const exists = await Category.findOne({ where: { name } })
        if (exists) return res.status(400).json({ message: "Category already exists" })

        const category = await Category.create({ name, description, image })
        return res.status(201).json(category)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getCategories = async (_req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name', 'price', 'stock', 'images']
            }],
            order: [['createdAt', 'DESC']]
        })

        // Add productCount to each category
        const categoriesWithCount = categories.map(cat => {
            const plainCat = cat.get({ plain: true });
            return {
                ...plainCat,
                productCount: plainCat.products ? plainCat.products.length : 0
            };
        });

        return res.json(categoriesWithCount)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const [updatedRowsCount] = await Category.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        })
        if (updatedRowsCount === 0) return res.status(404).json({ message: "Category not found" })

        const updatedCategory = await Category.findByPk(req.params.id)
        return res.json(updatedCategory)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const deletedRowsCount = await Category.destroy({ where: { id: req.params.id } })
        if (deletedRowsCount === 0) return res.status(404).json({ message: "Category not found" })
        return res.json({ message: "Category deleted" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { createCategory, getCategories, updateCategory, deleteCategory }
