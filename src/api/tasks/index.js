import express from "express";
import uniqid from "uniqid";

import { checkTaskSchema, triggerBadRequest } from "./validator.js";
import { getTasks, writeTasks } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const tasksRouter = express.Router();

//1. POST: http://localhost:3005/tasks
tasksRouter.post("/", checkTaskSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request Body is: ", req.body);

  try {
    const task = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };

    console.log("the task is: ", task);

    const tasksList = await getTasks();
    tasksList.push(task);

    await writeTasks(tasksList);
    res.status(201).send({ message: `Task: ${task.name} with id: ${task._id} has been successfully created` });
  } catch (error) {
    next(error);
  }
});

// 2. GET: http://localhost:3005/tasks/
tasksRouter.get("/", async (req, res, next) => {
  try {
    const tasksList = await getTasks();

    if (req.query && req.query.category) {
      const filteredTasks = tasksList.filter(
        (task) => task.category.toLowerCase() === req.query.category.toLowerCase()
      );
      res.send(filteredTasks);
    } else {
      res.send(tasksList);
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET: http://localhost:3005/tasks/:taskId
tasksRouter.get("/:taskId", (req, res) => {
  res.send({ message: "This is the GET single task route" });
});

// 4. PUT: http://localhost:3005/tasks/:taskId
tasksRouter.put("/:taskId", (req, res) => {
  res.send({ message: "This is the PUT single task route" });
});

// 5. DELETE: http://localhost:3005/tasks/:taskId
tasksRouter.delete("/:taskId", (req, res) => {
  res.send({ message: "This is the DELETE single task route" });
});

export default tasksRouter;
