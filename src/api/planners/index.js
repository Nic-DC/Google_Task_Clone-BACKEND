import express from "express";
import uniqid from "uniqid";

import { checkPlannerSchema, triggerBadRequest } from "./validator.js";
import { getPlanners, writePlanners } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const plannersRouter = express.Router();

//1. POST: http://localhost:3005/planners
plannersRouter.post("/", checkPlannerSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request Body is: ", req.body);

  try {
    const planner = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };

    console.log("the planner is: ", planner);

    const plannerList = await getPlanners();
    plannerList.push(planner);

    await writePlanners(plannerList);

    res.status(201).send({ message: `Planner: ${planner.name} with id: ${planner._id} has been successfully created` });
  } catch (error) {
    next(error);
  }
});

// 2. GET: http://localhost:3005/planners/
plannersRouter.get("/", async (req, res, next) => {
  try {
    const plannerList = await getPlanners();
    console.log("The planners list is: ", plannerList);

    if (plannerList.length) {
      res.send(plannerList);
    } else {
      next(NotFound(`You don not have any planners yet. Click the + button to create one`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET: http://localhost:3005/planners/:plannerId
plannersRouter.get("/:plannerId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const plannerList = await getPlanners();
    const planner = plannerList.find((planner) => planner._id === plannerId);

    if (planner) {
      res.send(planner);
    } else {
      next(NotFound(`Planner with id: ${plannerId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT: http://localhost:3005/planners/:plannerId
plannersRouter.put("/:plannerId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const plannerList = await getPlanners();
    const index = plannerList.findIndex((planner) => planner._id === plannerId);

    if (index !== -1) {
      const oldPlanner = plannerList[index];
      const updatedPlanner = { ...oldPlanner, ...req.body, updatedAt: new Date() };
      plannerList[index] = updatedPlanner;

      console.log("The updated planner looks like this: ", updatedPlanner);
      await writePlanners(plannerList);
      res.send(updatedPlanner);
    } else {
      next(NotFound(`The planner with id: ${plannerId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE: http://localhost:3005/planners/:plannerId
plannersRouter.delete("/:plannerId", async (req, res, next) => {
  try {
    const { plannerId } = req.params;
    const plannerList = await getPlanners();
    const remainingPlanners = plannerList.filter((planner) => planner._id !== plannerId);

    if (plannerList.length !== remainingPlanners.length) {
      await writePlanners(remainingPlanners);
      res.send({ message: `Planner with id: ${plannerId} deleted successfully` });
    } else {
      next(NotFound(`Planner with id: ${plannerId} is not in your archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default plannersRouter;
