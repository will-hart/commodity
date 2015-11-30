class Agent {
  constructor(tradesIn = [], startingCash = 50000) {
    this._holdings = {};
    this._trades = tradesIn;
    this._cash = startingCash;
  }

  // update(commodities) {
  //
  // }

  buy(commodity, quantity, price) {
    if (!this._holdings.hasOwnProperty(commodity.name)) {
      this._holdings[commodity.name] = 0;
    }

    if (quantity * price > this._cash) {
      quantity = Math.floor(this._cash / price);
    }

    this._cash -= quantity * price;
    this._holdings[commodity.name] += quantity;
  }

  sell(commodity, quantity, price) {
    if (!this._holdings.hasOwnProperty(commodity.name)) {
      this._holdings[commodity.name] = 0;
      return;
    }

    quantity = Math.min(quantity, this._holdings[commodity.name]);

    this._cash += quantity * price;
    this._holdings[commodity.name] -= quantity;
  }

  getTradesIn(commodity) {
    if (!this._trades.length) {
      return true;
    }

    return this._trades.indexOf(commodity) !== -1;
  }
}

export default Agent;
