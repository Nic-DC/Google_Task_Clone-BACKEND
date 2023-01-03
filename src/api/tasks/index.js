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
tasksRouter.get("/:taskId", async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const tasksList = await getTasks();

    const task = tasksList.find((task) => task._id === taskId);

    if (task) {
      res.send(task);
    } else {
      next(NotFound(`The task with id: ${taskId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT: http://localhost:3005/tasks/:taskId
tasksRouter.put("/:taskId", async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const tasksList = await getTasks();

    const index = tasksList.findIndex((task) => task._id === taskId);

    if (index !== -1) {
      const oldTask = tasksList[index];
      const updatedTask = { ...oldTask, ...req.body, updatedAt: new Date() };
      tasksList[index] = updatedTask;

      console.log("The updated task looks like this: ", updatedTask);

      res.send(updatedTask);
    } else {
      next(NotFound(`The task with id: ${taskId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE: http://localhost:3005/tasks/:taskId
tasksRouter.delete("/:taskId", async (req, res, next) => {
  try {
    const tasksList = await getTasks();

    const remainingTasks = tasksList.filter((task) => task._id !== req.params.taskId);

    if (tasksList.length !== remainingTasks.length) {
      res.send({ message: `Task with id: ${req.params.taskId} deleted successfully` });
    } else {
      next(NotFound(`Task with id: ${req.params.taskId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default tasksRouter;
