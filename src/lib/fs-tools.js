import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
console.log("The dataFolderPath is: ", dataFolderPath);

const publicFolderPathTasks = join(process.cwd(), "./public/img/tasks");
const publicFolderPathPlanners = join(process.cwd(), "./public/img/planners");

const tasksJSONPath = join(dataFolderPath, "tasks.json");
const plannersJSONPath = join(dataFolderPath, "planners.json");

export const getTasks = () => readJSON(tasksJSONPath);
export const writeTasks = (tasksList) => writeJSON(tasksJSONPath, tasksList);

export const getPlanners = () => readJSON(plannersJSONPath);
export const writePlanners = (plannersList) => writeJSON(plannersJSONPath, plannersList);

export const saveProductsImages = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPathTasks, fileName), contentAsBuffer);
export const saveReviewsImages = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPathPlanners, fileName), contentAsBuffer);
