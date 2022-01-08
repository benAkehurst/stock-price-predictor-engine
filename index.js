// Server Dependencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressPinoLogger = require('express-pino-logger');
const logger = require('./services/loggerService');

const { fetchRawData } = require('./helpers/data-fetcher');
const { dataConverter } = require('./helpers/converter');
const { makePrediction } = require('./helpers/predictor');

// Init Express
const app = express();
require('dotenv').config();

// Server Config
const loggerMiddleware = expressPinoLogger({
  logger: logger,
  autoLogging: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Cors Controls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

// Routes Definitions
app.get(`/api/v1/predict/:stockSymbol`, async (req, res) => {
  logger.info('predict route is accessed');
  const startTime = new Date().getTime();
  const stockSymbol = req.params.stockSymbol;
  const rawData = await fetchRawData(stockSymbol);
  const convertedData = await dataConverter(rawData);
  const prediction = await makePrediction(convertedData);
  try {
    if (prediction) {
      const endTime = new Date().getTime();
      Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
      res.status(200).json({
        message: 'Prediction made successfully!',
        predictionData: prediction[0],
        timeElapsed: `${(endTime - startTime) / 1000} seconds`,
      });
    } else {
      const endTime = new Date().getTime();
      res.status(500).json({
        message: 'Prediction failed',
        predictionData: null,
        timeElapsed: `${(endTime - startTime) / 1000} seconds`,
      });
    }
  } catch (error) {
    const endTime = new Date().getTime();
    res.status(500).json({
      message: 'General error',
      predictionData: null,
      timeElapsed: `${(endTime - startTime) / 1000} seconds`,
    });
  }
});

// 404 Handling
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '8080';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
