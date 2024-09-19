'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tasks', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tasks', 'userId');
  },
};