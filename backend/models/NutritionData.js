module.exports = (sequelize, DataTypes) => {
    const NutritionData = sequelize.define('NutritionData', {
        recipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        calories: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        protein: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        carbs: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        fat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        fiber: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vitaminA: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vitaminC: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        vitaminD: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        calcium: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        iron: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        potassium: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        healthBenefits: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    });

    NutritionData.associate = (models) => {
        NutritionData.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    };

    return NutritionData;
};
