'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('twits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: new Sequelize.UUIDV4(),
        unique: true,
        primaryKey: true
      },    
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.STRING(550),
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      likecount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
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
    await queryInterface.dropTable('twits');
  }
};