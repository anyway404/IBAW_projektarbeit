import express from "express";
import _ from "lodash";
import cars from "../data/cars.json";
import mongoose from "mongoose";

require("dotenv").config();
const DB_URL = process.env.DB_URL;

const router = express.Router();

let carsArray = cars;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once("open", () => {
  console.log("connected to MongoDB");
});

const CarsSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  brand: String,
  name: String,
  type: String,
  seats: Number,
  year: Number,
  km: Number,
  use: String,
  availability: String,
});

const CarModel = mongoose.model("Car", CarsSchema);

router.get("/", async (req, res) => {
  try {
    const cars = await CarModel.find();
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).send(`Car ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/", (req, res) => {
  const id = new mongoose.Types.ObjectId();
  const carToPersist = Object.assign(
    {
      _id: id,
    },
    req.body
  );

  const car = new CarModel(carToPersist);

  car.save().then((err, car) => {
    if (err) res.status(500).send(err);
    res.json(car);
  });
});

router.put("/:id", async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (car) {
      car.brand = req.body.brand;
      car.name = req.body.name;
      car.type = req.body.type;
      car.seats = req.body.seats;
      car.year = req.body.year;
      car.km = req.body.km;
      car.use = req.body.use;
      car.availability = req.body.availability;

      await car.save();
      res.json(car);
    } else {
      res.status(404).send(`Car ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const car = await CarModel.findByIdAndDelete(req.params.id);
    if (car) {
      res.status(200).send(`Car with id ${req.params.id} was deleted`);
    } else {
      res.status(404).send(`Car ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
