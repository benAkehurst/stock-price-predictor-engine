const axios = require("axios");

exports.fetchRawData = async (stockSymbol) => {
  return await axios
    .get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}&datatype=json`
    )
    .then((data) => {
      const responseFromApi = data.data;
      if (responseFromApi.hasOwnProperty("Error Message")) {
        return {
          success: false,
          message: "Stock symbol not found",
        };
      } else {
        return {
          success: true,
          data: responseFromApi,
        };
      }
    });
};
