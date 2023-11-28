// const Assignment = require('../models/assignment');
// const { DataTypes } = require('sequelize');
// const sequelize = require("sequelize");
const Assignment = require("../models/assignment");
const Submission = require("../models/submissions");
const { authenticate } = require("../utils/authenticator");
const _ = require("lodash");
const { format } = require("date-fns");
const {
  standardOutputLogger,
  standardErrorLogger,
} = require("../utils/logger");
const client = require("../utils/statsdutil");
const { publishMessage } = require("../utils/publisher");

async function postassg(req, res) {
  client.increment("API.assignment.POST");
  if (JSON.stringify(req.body).length <= 2) {
    console.log("Please pass request body.");
    standardErrorLogger.error("Request body not found.");
    res.status(400).send("Please pass request body.");
  } else {
    if (await authenticate(req, res)) {
      try {
        //console.log("IDDD: " + req.user.id);
        const { name, points, num_of_attempts, deadline } = req.body;
        if (!deadline) {
          standardErrorLogger.error("Deadline cannot be null.");
          return res.status(400).json({ error: "Deadline cannot be null." });
        } else if (
          new Date(deadline) instanceof Date &&
          !isNaN(new Date(deadline))
        ) {
          const assignmentInstance = await Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline: new Date(deadline).toISOString(),
            userid: req.user.id,
          });

          //await assignmentInstance.save();
          standardOutputLogger.info("Assignment created.");
          res.status(201).json(assignmentInstance);
        } else {
          standardErrorLogger.error("Invalid deadline.");
          return res.status(400).json({ error: "Invalid deadline." });
        }
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          const validationErrors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));
          standardErrorLogger.error(
            "Validation Errors:" + JSON.stringify(validationErrors)
          );
          return res.status(400).json({ errors: validationErrors });
        }

        console.error("Error:", error);
        standardErrorLogger.error("Something went wrong in POST controller.");
        res
          .status(500)
          .json({ error: "Something went wrong in POST controller." });
      }
    }
    //   else {
    //     res.status(401).send("Unauthorized: Authentication failed.");
    //   }
  }
}

async function getassg(req, res) {
  client.increment("API.assignment.GET");
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    standardErrorLogger.error("Request payload not allowed.");
    res.status(403).send("Request payload not allowed.");
  } else {
    if (await authenticate(req, res)) {
      try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId, {
          attributes: { exclude: ["userid"] },
        });

        if (!assignment) {
          standardErrorLogger.error("Assignment not found");
          return res.status(404).json({ error: "Assignment not found" });
        }
        standardOutputLogger.info("Assignment retrieved.");
        return res.status(200).json(assignment);
      } catch (error) {
        console.error("Error retrieving assignment:", error);
        standardErrorLogger.error("Error retrieving assignment:", error);
        return res.status(500).json({ error: "Unexpected error." });
      }
    }
  }
}

async function getallassg(req, res) {
  client.increment("API.assignment.GETAll");
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    standardErrorLogger.error("Request payload not allowed.");
    res.status(403).send("Request payload not allowed.");
  } else {
    if (await authenticate(req, res)) {
      try {
        //const assignmentId = req.params.id;
        const assignment = await Assignment.findAll({
          attributes: { exclude: ["userid"] },
        });

        if (assignment.length === 0) {
          standardErrorLogger.error("Assignments not found");
          return res.status(404).json({ error: "Assignments not found" });
        }
        //const { userid, ...assignmentWithoutUserId } = assignment;
        standardOutputLogger.info("Assignments retrieved.");
        return res.status(200).json(assignment);
      } catch (error) {
        console.error("Error retrieving assignments:", error);
        standardErrorLogger.error("Error retrieving assignments:", error);
        return res.status(500).json({ error: "Error retrieving assignments" });
      }
    }
  }
}

async function putassg(req, res) {
  client.increment("API.assignment.PUT");
  if (JSON.stringify(req.body).length <= 2) {
    console.log("Please pass request body.");
    standardErrorLogger.error("Request body not found.");
    res.status(400).send("Please pass request body.");
  } else {
    try {
      if (await authenticate(req, res)) {
        //console.log("Authenticated!+" + req.user.id);

        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignmentId) {
          standardErrorLogger.error("Incorrect ID passed.");
          return res.status(400).json({ error: "Incorrect id." });
        }

        if (!assignment) {
          standardErrorLogger.error("Assignment not found.");
          return res.status(404).json({ error: "Assignment not found" });
        }

        if (req.user.id != assignment.userid) {
          standardErrorLogger.error("Unauthorized user for this assignment.");
          return res
            .status(403)
            .json({ error: "Unauthorized user for this assignment." });
        }

        const { name, points, num_of_attempts, deadline } = req.body;

        const newAssignment = {
          name,
          points,
          num_of_attempts,
          deadline: new Date(deadline).toISOString(),
        };

        const hasChanges =
          (newAssignment.name !== undefined &&
            newAssignment.name !== assignment.name) ||
          (newAssignment.points !== undefined &&
            newAssignment.points !== assignment.points) ||
          (newAssignment.num_of_attempts !== undefined &&
            newAssignment.num_of_attempts !== assignment.num_of_attempts) ||
          (newAssignment.deadline !== undefined &&
            new Date(newAssignment.deadline).toISOString() !==
              new Date(assignment.deadline).toISOString());

        if (hasChanges) {
          try {
            //console.log("Changes found!!!");
            // Update the assignment with the new values
            //console.log("Nameee:" + name);
            await assignment.update({
              name,
              points,
              num_of_attempts,
              deadline,
            });
            standardOutputLogger.info("Assignment updated.");
            return res.status(204).json(assignment);
          } catch (error) {
            if (error.name === "SequelizeValidationError") {
              const validationErrors = error.errors.map((err) => ({
                field: err.path,
                message: err.message,
              }));
              standardErrorLogger.error(
                "Validation Errors:" + JSON.stringify(validationErrors)
              );
              return res.status(400).json({ errors: validationErrors });
            }
          }
        } else {
          console.log("Changes NOT found!!!");
          standardErrorLogger.error("No changes found.");
          return res.status(304).json("No changes found!!!");
        }
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      standardErrorLogger.error("Error updating assignment:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong while updating the assignment." });
    }
  }
}

async function deleteassg(req, res) {
  client.increment("API.assignment.DELETE");
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    standardErrorLogger.error("Request payload not allowed.");
    res.status(403).send("Request payload not allowed.");
  } else {
    try {
      if (await authenticate(req, res)) {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignmentId) {
          standardErrorLogger.error("Incorrect id.");
          return res.status(400).json({ error: "Incorrect id." });
        }

        if (!assignment) {
          standardErrorLogger.error("Assignment not found");
          return res.status(404).json({ error: "Assignment not found" });
        }

        if (req.user.id != assignment.userid) {
          standardErrorLogger.error("Unauthorized user for this assignment.");
          return res
            .status(403)
            .json({ error: "Unauthorized user for this assignment." });
        }

        const deletedRowCount = await Assignment.destroy({
          where: { id: assignmentId },
        });
        if (deletedRowCount > 0) {
          standardOutputLogger.info("Assignment deleted successfully");
          res.status(204).json({ message: "Assignment deleted successfully" });
        }
      }
    } catch (error) {
      standardErrorLogger.error(
        "Something went wrong while deleting the assignment."
      );
      return res.status(500).json({
        message: "Something went wrong while deleting the assignment.",
        error: error.message,
      });
    }
  }
}

async function submitassg(req, res) {
  client.increment("API.assignment.POST_Submission");
  if (JSON.stringify(req.body).length <= 2) {
    console.log("Please pass request body.");
    standardErrorLogger.error("Request body not found.");
    res.status(400).send("Please pass request body.");
  } else {
    if (await authenticate(req, res)) {
      try {
        //console.log("IDDD: " + req.user.id);
        const assignmentId = req.params.id;
        const { submission_url } = req.body;
        let submissionInstance;
        const assignment = await Assignment.findByPk(assignmentId, {
          attributes: { exclude: ["userid"] },
        });
        if (!assignmentId) {
          standardErrorLogger.error("Invalid assignment ID.");
          return res.status(404).json({ error: "Invalid assignment ID." });
        }

        if (!submission_url) {
          standardErrorLogger.error("Invalid submission URL.");
          return res.status(404).json({ error: "Invalid submission URL." });
        }
        if (!assignment) {
          standardErrorLogger.error("Assignment not found");
          return res.status(404).json({ error: "Assignment not found" });
        }
        const userId = req.user.id;
        const existingSubmission = await Submission.findOne({
          where: {
            assignment_id: assignmentId,
            userid: userId,
          },
        });

        if (existingSubmission) {
          const existingDeadline = assignment.deadline.toISOString();
          const currentDate = format(
            new Date(),
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
          );
          // console.log(
          //   "existing deadline:" + assignment.deadline.toISOString()
          //   // format(assignment.deadline, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          // );
          // console.log(
          //   "new Date:" + format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          // );
          if (currentDate < existingDeadline) {
            if (
              existingSubmission.submission_urls.length >=
              assignment.num_of_attempts
            ) {
              standardErrorLogger.error("No attempts left.");
              return res.status(403).json({ error: "No attempts left." });
            } else {
              const updatedUrls =
                existingSubmission.submission_urls.concat(submission_url);
              submissionInstance = await existingSubmission.update({
                submission_urls: updatedUrls,
              });
            }
          } else {
            standardErrorLogger.error("Deadline has passed.");
            return res.status(403).json({ error: "Deadline has passed." });
          }
        } else {
          submissionInstance = await Submission.create({
            assignment_id: assignmentId,
            submission_urls: [submission_url],
            userid: userId,
          });
        }

        const data = {
          email: req.user.id,
          url: submission_url,
        };
        const message = `User Email: ${data.email}, URL: ${data.url}`;
        publishMessage(message);

        standardOutputLogger.info("Assignment submitted.");
        res.status(201).json(submissionInstance);
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          const validationErrors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));
          standardErrorLogger.error(
            "Validation Errors:" + JSON.stringify(validationErrors)
          );
          return res.status(400).json({ errors: validationErrors });
        }

        console.error("Error:", error);
        standardErrorLogger.error(
          "Something went wrong in POST submission controller."
        );
        res.status(500).json({
          error: "Something went wrong in POST submission controller.",
        });
      }
    }
  }
}

async function invalidassg(req, res) {
  client.increment("API.assignment.Invalid");
  standardErrorLogger.error("Method Not Allowed");
  res.status(405).send("Method Not Allowed");
}
module.exports = {
  postassg,
  getassg,
  getallassg,
  putassg,
  invalidassg,
  deleteassg,
  submitassg,
};
