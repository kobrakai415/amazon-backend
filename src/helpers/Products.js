const ProductModel = (sequelize, DataTypes) => {
    const Products = sequelize.define('products', {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        /*  category: {
             type: DataTypes.TEXT,
             allowNull: false,
         }, */
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        brand: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    })
    return Products
}

export default ProductModel