require('dotenv').config();
const { sequelize } = require('./src/config/db');
require('./src/models');
async function run() {
    await sequelize.sync({ alter: true });
    console.log("Database altered");
    process.exit(0);
}
run();
