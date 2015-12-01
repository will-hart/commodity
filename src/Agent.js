import { shuffleArray } from "./utils";

class Agent {
  constructor(tradesIn = [], startingCash = 50000) {
    this._holdings = {};
    this._trades = tradesIn;
    this._cash = startingCash;
  }

  update(commodities = []) {

    if (commodities.length === 0) {
      return;
    }

    let self = this;

    shuffleArray(commodities).forEach((c) => {
      let qty = self.getAction(c);

      if (qty > 0) {
        self.buy(c, qty, c.price);
      } else if (qty < 0) {
        self.sell(c, qty, c.price);
      }
    })
  }

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

  getAction(commodity) {
    if (this._trades.length > 0 &&
      this._trades.indexOf(commodity.name) === -1) {
        return 0;
      }

    if (commodity.price == commodity.movingAverage) {
      return 0;
    } else if (commodity.price > commodity.movingAverage) {
      if (this._holdings.hasOwnProperty(commodity.name) &&
        this._holdings[commodity.name] > 0) {
        return -this._holdings[commodity.name];
      }
    } else if (commodity.price < commodity.movingAverage) {
      if (this._cash > 0) {
        return Math.floor(this._cash / commodity.price);
      }
    }

    return 0;
  }
}

export default Agent;
