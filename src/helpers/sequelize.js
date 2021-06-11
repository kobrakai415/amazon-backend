import s from 'sequelize'
import pg from 'pg'
import ProductModel from './Products.js'
import ReviewModel from './Reviews.js'
import CategoryModel from './Category.js'
const Sequelize = s.Sequelize;
const DataTypes = s.DataTypes;
const { PGDATABASE, PGUSERNAME, PGPASSWORD, PGHOST } = process.env
const sequelize = new Sequelize(PGDATABASE, PGUSERNAME, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres'
});

const test = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

const models = {
    Products: ProductModel(sequelize, DataTypes),
    Reviews: ReviewModel(sequelize, DataTypes),
    Category: CategoryModel(sequelize, DataTypes),
    sequelize: sequelize,
}

models.Category.hasMany(models.Products);
models.Products.belongsTo(models.Category);

models.Products.hasMany(models.Reviews);
models.Reviews.belongsTo(models.Products);




test()
export default models


