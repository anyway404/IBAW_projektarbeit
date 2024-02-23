import express from "express";
import morgan from "morgan";
import CarsRoute from "./routes/CarsRoute";
import cars from "./data/cars.json";
import _ from "lodash";
import bodyParser from "body-parser";
import path from "path";

const PORT = 3000;

const buildUrl = (version, path) => `/api/${version}/${path}`;
const CARS_BASE_URL = buildUrl("v1", "cars");

const server = express();

server.use(morgan("tiny"));
server.use(bodyParser.json());
server.use(express.static("public"));

server.use(CARS_BASE_URL, CarsRoute);

server.get("/download/images/:imageName", (req, res) => {
  res.download(path.join("public", "images", req.params.imageName));
});

server.get(
  "/route-handlers",
  (req, res, next) => {
    res.send("route handler");
    next();
  },
  (req, res, next) => {
    console.log("second handler");
    next();
  },
  (req, res) => {
    console.log("third handler");
  }
);

server.listen(3000, () => {
  console.log(`server started on port ${PORT}`);
});
