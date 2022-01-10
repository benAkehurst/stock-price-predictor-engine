const { dataConverter } = require("./converter");

describe("Data Converter", () => {
  test("Convert data to correct format", async () => {
    const rawData = {
      "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "IBM",
        "3. Last Refreshed": "2022-01-07",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern",
      },
      "Time Series (Daily)": {
        "2022-01-07": {
          "1. open": "134.9000",
          "2. high": "135.6618",
          "3. low": "133.5111",
          "4. close": "134.8300",
          "5. volume": "5238099",
        },
      },
    };
    const convertedData = await dataConverter(rawData);
    expect(convertedData).toEqual([
      {
        open: 134.9,
        high: 135.6618,
        low: 133.5111,
        close: 134.83,
      },
    ]);
  });
});
