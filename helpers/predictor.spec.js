const { predictionTrend } = require("./predictor");

describe("predictionTrend", () => {
  it("should return a trend", async () => {
    const prediction = {
      open: 178.4349456310272,
      high: 180.6674599456787,
      low: 174.73712194919585,
      close: 174.73712194919585,
    };
    const trend = await predictionTrend(prediction);
    expect(trend).toEqual({
      trend: "down",
      percentage: 0.020723651797881652,
    });
  });
});
