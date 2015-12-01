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
      this._holdings[commodity.name] = {
        qty: 0,
        purchase: []
      };
    }

    if (quantity * price > this._cash) {
      quantity = Math.floor(this._cash / price);
    }

    this._cash -= quantity * price;
    this._holdings[commodity.name].qty += quantity;
    this._holdings[commodity.name].purchase.push({
      qty: quantity,
      price: price
    });
  }

  sell(commodity, quantity, price) {
    if (quantity < 0) {
      return;
    }

    if (!this._holdings.hasOwnProperty(commodity.name)) {
      this._holdings[commodity.name] = {
        qty: 0,
        purchase: []
      };
      return;
    }

    let holding = this._holdings[commodity.name];
    quantity = Math.min(quantity, holding.qty);

    // update positions
    this._cash += quantity * price;
    holding.qty -= quantity;

    // remove purchase records
    this._updatePurchaseRecords(quantity, holding);
  }

  _updatePurchaseRecords(quantity, holding) {
    while (quantity > 0 && holding.purchase.length) {
      let sold = Math.min(quantity, holding.purchase[0].qty);

      if (sold === holding.purchase[0].qty) {
        // sold this purchase off
        holding.purchase = holding.purchase.slice(1);
      } else {
        holding.purchase[0].qty -= quantity;
      }

      quantity -= sold;
    }
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
        this._holdings[commodity.name].qty > 0) {
        return this._getAmountSold(
          this._holdings[commodity.name], commodity.price);
      }
    } else {
      return this._getAmountPurchased(commodity.price);
    }

    return 0;
  }

  _getAmountPurchased(price) {
    if (this._cash < 0.5 * this._startingCash) {
      return Math.floor(this._cash / price);
    }
    return Math.floor(this._cash * Math.random() * 0.7 / price);
  }

  _getAmountSold(holding, currentPrice) {
    let selling = holding.purchase.filter((h) => {
      return h.price < currentPrice;
    }).reduce((qty, h) => {
      return qty + h.qty;
    }, 0);

    return -selling;
  }
}

export default Agent;
