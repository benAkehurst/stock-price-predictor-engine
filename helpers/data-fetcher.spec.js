const { fetchRawData } = require("./data-fetcher");

describe("fetchRawData", () => {
  it("should return an object with success: true and data: responseFromApi", async () => {
    const stockSymbol = "AAPL";
    const result = await fetchRawData(stockSymbol);
    expect(result).toBeTruthy();
  });
  it("should return an object with success: false and message: 'Stock symbol not found'", async () => {
    const stockSymbol = "NOT_A_STOCK_SYMBOL";
    const result = await fetchRawData(stockSymbol);
    expect(result).toEqual({
      success: false,
      message: "Stock symbol not found",
    });
  });
});
