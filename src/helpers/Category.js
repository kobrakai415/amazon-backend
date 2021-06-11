
const CategoryModel = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    })
    return Category
}
export default CategoryModel