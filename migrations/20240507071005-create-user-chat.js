"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserChats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        references: {model: "Users", key: "id"},
        onUpdate: "cascade",
        onDelete: "cascade",
        type: Sequelize.INTEGER,
      },
      UserIdReceiver: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      usernameReceiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nameReceiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatarReceiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserChats");
  },
};
