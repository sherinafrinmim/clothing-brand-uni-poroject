const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ecommerce_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
)

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('MySQL connected successfully')

        // Sync all models with database
        await sequelize.sync({ alter: true })
        console.log('Database synchronized successfully')
    } catch (error) {
        console.error('Database connection error:', error.message)
        process.exit(1)
    }
}

module.exports = { sequelize, connectDB }
