// Server Dependencies
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");

const { fetchRawData } = require("./helpers/data-fetcher");
const { dataConverter } = require("./helpers/converter");
const { makePrediction, predictionTrend } = require("./helpers/predictor");

// Init Express
const app = express();
require("dotenv").config();

// Server Config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors Controls
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use(cors());

// Routes Definitions
app.get("/", (req, res) => {
  res.send("GCP App Engine!");
});
app.get(`/api/v1/predict/:stockSymbol`, async (req, res) => {
  const startTime = new Date().getTime();
  const stockSymbol = req.params.stockSymbol;
  const rawStockData = await fetchRawData(stockSymbol.trim());
  if (!rawStockData.success) {
    res.status(400).json({
      message: "Stock symbol not found",
    });
  } else {
    const convertedData = await dataConverter(rawStockData.data);
    const prediction = await makePrediction(convertedData);
    try {
      if (prediction) {
        const trend = await predictionTrend(prediction[0]);
        const endTime = new Date().getTime();
        res.status(200).json({
          message: "Prediction made successfully!",
          stockSymbol: stockSymbol,
          predictionData: prediction[0],
          priceTrend: trend,
          predictionTimeTaken: (endTime - startTime) / 1000,
          predictionMadeOnDate: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          message: "Prediction failed",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "General error",
      });
    }
  }
});
app.get(`/api/v1/test`, async (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

// 404 Handling
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

// Server Port Controls
const port = process.env.PORT || "8080";
app.set("port", port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
