const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");
const { format } = require("date-fns");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      readOnly: true,
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    account_created: {
      type: Sequelize.DATE,
      readOnly: true,
      defaultValue: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    },
    account_updated: {
      type: Sequelize.DATE,
      readOnly: true,
      defaultValue: () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Account;
