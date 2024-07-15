import Sequelize, { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  return queryInterface.createTable('links', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'used'),
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.dropTable('links', { transaction });
    await queryInterface.dropEnum('enum_links_statuses', { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
