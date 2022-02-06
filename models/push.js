'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class push extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  push.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: new DataTypes.UUIDV4(),
      unique: true,
      primaryKey: true
    },    
    text: {
      type: DataTypes.STRING(550),
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'push',
  });
  return push;
};