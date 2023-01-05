import express from "express";
import tasksRouter from "./api/tasks/index.js";
import plannersRouter from "./api/planners/index.js";

import listEndpoints from "express-list-endpoints";

import { join } from "path";

import { badRequestHandler, notFoundHandler, serverErrorHandler } from "./errorHandler.js";

import cors from "cors";

const server = express(); // create the server

const port = 3005;

const publicFolderPath = join(process.cwd(), "./public");
console.log("publicFolderPath: ", publicFolderPath);

server.use(express.static(publicFolderPath));
server.use(cors()); // Just to let FE communicate with BE successfully
server.use(express.json());

/*------------- ENDPOINTS -------------*/
server.use("/planners", tasksRouter);
server.use("/planners", plannersRouter);

/*----------- ERROR HANDLERS -------------*/
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(serverErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this server listens on port number: ", port);
}); // server is listening for requests
