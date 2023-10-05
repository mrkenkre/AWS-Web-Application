const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const { format } = require("date-fns");

const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      readOnly: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
        notEmpty: true,
      },
    },
    num_of_attempts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 3,
        notEmpty: true,
      },
    },
    deadline: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    assignment_created: {
      type: Sequelize.DATE,
      readOnly: true,
      defaultValue: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    },
    assignment_updated: {
      type: Sequelize.DATE,
      readOnly: true,
      defaultValue: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    },
    userid: {
      type: Sequelize.UUID,
      readOnly: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Assignment;
