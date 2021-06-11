
const ReviewModel = (sequelize, DataTypes) => {
    const Reviews = sequelize.define('reviews', {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    })
    return Reviews
}
export default ReviewModel