import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('files', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('files');
  },
};
