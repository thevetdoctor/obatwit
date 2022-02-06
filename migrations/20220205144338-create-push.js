'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pushes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: new Sequelize.UUIDV4(),
        unique: true,
        primaryKey: true
      },    
      text: {
        type: Sequelize.STRING(550),
        allowNull: false
      },
      // userId: {
      //   type: Sequelize.UUID,
      //   allowNull: false
      // },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pushes');
  }
};