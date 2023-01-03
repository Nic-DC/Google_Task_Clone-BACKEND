import express from "express";
import uniqid from "uniqid";

import { checkTaskSchema, triggerBadRequest } from "./validator.js";
import { getTasks, writeTasks } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const tasksRouter = express.Router();

//1. POST: http://localhost:3005/planners/:plannerId/tasks
tasksRouter.post("/:plannerId/tasks", checkTaskSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request Body is: ", req.body);

  try {
    const { plannerId } = req.params;
    console.log("plannerId is: ", plannerId);

    const task = {
      _id: uniqid(),
      ...req.body,
      plannerId: plannerId,
      createdAt: new Date(),
    };

    console.log("the task is: ", task);

    const tasksList = await getTasks();
    tasksList.push(task);

    await writeTasks(tasksList);
    res.status(201).send({
      message: `Task: ${task.name} with id: ${task._id} has been successfully created in the Planner width id: ${plannerId}`,
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET: http://localhost:3005/planners/:plannerId/tasks
tasksRouter.get("/:plannerId/tasks", async (req, res, next) => {
  try {
    const { plannerId } = req.params;

    const tasksList = await getTasks();

    const tasks = tasksList.filter((task) => task.plannerId === plannerId);

    if (tasks.length > 0) {
      if (req.query && req.query.category) {
        const filteredTasksCat = tasks.filter(
          (task) => task.category.toLowerCase() === req.query.category.toLowerCase()
        );
        res.send(filteredTasksCat);
      } else if (req.query & req.query.done) {
        const filteredTasksDone = tasks.filter((task) => task.done === req.query.done);
        res.send(filteredTasksDone);
      } else {
        const uncompletedTasks = tasks.filter((task) => task.done === "false");
        if (uncompletedTasks.length > 0) {
          res.send(uncompletedTasks);
        } else {
          next(NotFound(`There are NO uncompleted tasks in the planner with id: ${plannerId}`));
        }
      }
    } else {
      next(NotFound(`This planner, with id: ${plannerId} has no tasks yet.`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET: http://localhost:3005/planners/:plannerId/tasks/:taskId
tasksRouter.get("/:plannerId/tasks/:taskId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const taskId = req.params.taskId;

    const tasksList = await getTasks();
    const tasks = tasksList.filter((task) => task.plannerId === plannerId);

    if (tasks.length > 0) {
      const task = tasks.find((task) => task._id === taskId);

      if (task) {
        res.send(task);
      } else {
        next(NotFound(`The task with id: ${taskId} is not in your archive`));
      }
    } else {
      next(NotFound(`There are NO tasks in this planner with id: ${plannerId}`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT: http://localhost:3005/planners/:plannerId/tasks/:taskId
tasksRouter.put("/:plannerId/tasks/:taskId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const { taskId } = req.params;

    const tasksList = await getTasks();
    const tasks = tasksList.filter((task) => task.plannerId === plannerId);

    const index = tasks.findIndex((task) => task._id === taskId);

    if (tasks.length > 0) {
      if (index !== -1) {
        const oldTask = tasks[index];
        const updatedTask = { ...oldTask, ...req.body, updatedAt: new Date() };
        tasks[index] = updatedTask;

        console.log("The updated task looks like this: ", updatedTask);

        await writeTasks(tasks);
        res.send(updatedTask);
      } else {
        next(NotFound(`The task with id: ${taskId} is not in your archive`));
      }
    } else {
      next(NotFound(`There are no tasks in this planner with id: ${plannerId}`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE: http://localhost:3005/planners/:plannerId/tasks/:taskId
tasksRouter.delete("/:plannerId/tasks/:taskId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const tasksList = await getTasks();
    const tasks = tasksList.filter((task) => task.plannerId === plannerId);

    if (tasks.length > 0) {
      const remainingTasks = tasks.filter((task) => task._id !== req.params.taskId);

      if (tasks.length !== remainingTasks.length) {
        await writeTasks(remainingTasks);
        res.send({ message: `Task with id: ${req.params.taskId} deleted successfully` });
      } else {
        next(NotFound(`Task with id: ${req.params.taskId} is not in your archive`));
      }
    } else {
      next(NotFound(`There are NO tasks for this planner with id: ${plannerId}`));
    }
  } catch (error) {
    next(error);
  }
});

export default tasksRouter;
