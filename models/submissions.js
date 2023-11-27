const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const { format } = require("date-fns");

const Submission = sequelize.define(
  "Submissions",
  {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      required: true,
      readOnly: true,
      primaryKey: true,
    },
    assignment_id: {
      type: Sequelize.UUID,
      required: true,
      readOnly: true,
      allowNull: false,
    },
    submission_urls: {
      type: Sequelize.JSON,
      required: true,
      allowNull: false,
    },
    submission_date: {
      type: Sequelize.DATE,
      readOnly: true,
    },
    submission_updated: {
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
    hooks: {
      beforeCreate: (submission, options) => {
        submission.submission_date = format(
          new Date(),
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        );
      },

      beforeUpdate: (submission, options) => {
        submission.submission_updated = format(
          new Date(),
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        );
      },
    },
  }
);

module.exports = Submission;
