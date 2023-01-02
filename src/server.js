import express from "express";

const port = 3005;
const server = express(); // create the server

server.listen(port, () => {
  console.log("this server listens on port number: ", port);
}); // server is listening for requests
