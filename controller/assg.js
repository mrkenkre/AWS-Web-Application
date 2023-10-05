// const Assignment = require('../models/assignment');
// const { DataTypes } = require('sequelize');
// const sequelize = require("sequelize");
const Assignment = require("../models/assignment");
const db = require("../models/index");
const { authenticate } = require("../utils/authenticator");
const _ = require("lodash");

async function postassg(req, res) {
  //console.log("Stat: " + (await authenticate(req, res)));

  if (await authenticate(req, res)) {
    if (JSON.stringify(req.body).length <= 2) {
      console.log("Request payload not found.");
      res.status(400).send("Request payload not found.");
    } else {
      try {
        //console.log("IDDD: " + req.user.id);
        const { name, points, num_of_attempts, deadline } = req.body;

        const assignmentInstance = await Assignment.create({
          name,
          points,
          num_of_attempts,
          deadline: new Date(deadline).toISOString(),
          userid: req.user.id,
        });

        //await assignmentInstance.save();
        res.status(201).json(assignmentInstance);
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return res
            .status(400)
            .json({ error: "Assignment with the same name already exists." });
        }

        if (error.name === "SequelizeValidationError") {
          const validationErrors = error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          }));

          return res.status(400).json({ errors: validationErrors });
        }

        console.error("Error:", error);
        res.status(500).json({ error: "Error submitting the assignment." });
      }
    }
    //   else {
    //     res.status(401).send("Unauthorized: Authentication failed.");
    //   }
  }
}

async function getassg(req, res) {
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    res.status(400).send("Request payload not allowed.");
  } else {
    if (await authenticate(req, res)) {
      try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId, {
          attributes: { exclude: ["userid"] },
        });

        if (!assignment) {
          return res.status(204).json({ error: "Assignment not found" });
        }
        return res.status(200).json(assignment);
      } catch (error) {
        console.error("Error retrieving assignment:", error);
        return res.status(500).json({ error: "Error retrieving assignment" });
      }
    }
  }
}

async function getallassg(req, res) {
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    res.status(400).send("Request payload not allowed.");
  } else {
    if (await authenticate(req, res)) {
      try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findAll(assignmentId, {
          attributes: { exclude: ["userid"] },
        });

        if (!assignment) {
          return res.status(204).json({ error: "Assignments not found" });
        }
        return res.status(200).json(assignment);
      } catch (error) {
        console.error("Error retrieving assignments:", error);
        return res.status(500).json({ error: "Error retrieving assignments" });
      }
    }
  }
}

async function putassg(req, res) {
  try {
    if (await authenticate(req, res)) {
      if (JSON.stringify(req.body).length <= 2) {
        console.log("Request payload not found.");
        res.status(400).send("Request payload not found.");
      } else {
        //console.log("Authenticated!+" + req.user.id);

        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
          return res.status(400).json({ error: "Assignment not found" });
        }

        if (req.user.id != assignment.userid) {
          return res
            .status(401)
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
          console.log("Changes found!!!");
          // Update the assignment with the new values
          await assignment.update({
            name,
            points,
            num_of_attempts,
            deadline,
          });
          return res.status(201).json(assignment);
        } else {
          console.log("Changes NOT found!!!");
          return res.status(304).json("No changes found!!!");
        }
      }
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({ error: "Error updating assignment" });
  }
}

async function deleteassg(req, res) {
  if (JSON.stringify(req.body).length > 2) {
    console.log("Request payload not allowed.");
    res.status(400).send();
  } else {
    try {
      if (await authenticate(req, res)) {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
          return res.status(204).json({ error: "Assignment not found" });
        }

        if (req.user.id != assignment.userid) {
          return res
            .status(403)
            .json({ error: "Unauthorized user for this assignment." });
        }

        const deletedRowCount = await Assignment.destroy({
          where: { id: assignmentId },
        });
        if (deletedRowCount > 0) {
          res.status(204).json({ message: "Assignment deleted successfully" });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting the assignment.",
        error: error.message,
      });
    }
  }
}

async function invalidassg(req, res) {
  res.status(405).send("Method Not Allowed");
}
module.exports = {
  postassg,
  getassg,
  getallassg,
  putassg,
  invalidassg,
  deleteassg,
};
