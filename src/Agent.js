import { shuffleArray } from "./utils";

class Agent {
  constructor(tradesIn = [], startingCash = 50000) {
    this._holdings = {};
    this._trades = tradesIn;
    this._cash = startingCash;
    this._startingCash = startingCash;
    this._tradingHold = 0;
  }

  update(commodities = []) {

    if (commodities.length === 0) {
      return;
    }

    shuffleArray(commodities).forEach((c) => {
      let qty = this.getAction(c);

      if (qty > 0 && this._tradingHold <= 0) {
        this.buy(c, qty, c.price);

        this._tradingHold = Math.floor(Math.random() * 7 + 3); // pause 3-10 pds
      } else if (qty < 0) {
        this.sell(c, -qty, c.price);
      }
    });

    this._tradingHold--;
  }

  buy(commodity, quantity, price) {
    if (quantity < 0) {
      return;
    }

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
    if (quantity < 0) {
      return;
    }

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

    if (commodity.price === commodity.movingAverage) {
      return 0;
    }

    if (commodity.price > commodity.movingAverage) {
      if (this._holdings.hasOwnProperty(commodity.name) &&
        this._holdings[commodity.name] > 0) {
        return -this._holdings[commodity.name];
      }
    } else {
      return this._getAmountTraded(commodity.price);
    }

    return 0;
  }

  _getAmountTraded(price) {
    if (this._cash < 0.5 * this._startingCash) {
      return Math.floor(this._cash / price);
    }
    return Math.floor(this._cash * Math.random() * 0.7 / price);
  }
}

export default Agent;
