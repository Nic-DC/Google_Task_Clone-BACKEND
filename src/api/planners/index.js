import express from "express";

const plannersRouter = express.Router();

//1. POST: http://localhost:3005/planners
plannersRouter.post("/", (req, res) => {
  res.send({ message: "This is the POST route" });
});

// 2. GET: http://localhost:3005/planners/
plannersRouter.get("/", (req, res) => {
  res.send({ message: "This is the GET route" });
});

// 3. GET: http://localhost:3005/planners/:plannerId
plannersRouter.get("/:taskId", (req, res) => {
  res.send({ message: "This is the GET single planner route" });
});

// 4. PUT: http://localhost:3005/planners/:plannerId
plannersRouter.put("/:taskId", (req, res) => {
  res.send({ message: "This is the PUT single planner route" });
});

// 5. DELETE: http://localhost:3005/planners/:plannerId
plannersRouter.delete("/:taskId", (req, res) => {
  res.send({ message: "This is the DELETE single planner route" });
});

export default plannersRouter;
