import chai from "chai"
const expect = chai.expect;

import Agent from "../src/Agent"
import Commodity from "../src/Commodity"

describe("Agent", () => {
  it ("should trade in every commodity if no tradesIn array passed", () => {
    let a = new Agent();
    expect(a.getTradesIn("wood")).to.equal(true);
    expect(a.getTradesIn("oil")).to.equal(true);
  });

  it ("should allow setting traded commodities in the constructor", () => {
    let a = new Agent(["wood"]);
    expect(a._trades).to.deep.equal(["wood"]);
  });

  it ("should trade in values in the trades in array", () => {
    let a = new Agent(["wood"]);
    expect(a.getTradesIn("wood")).to.equal(true);
    expect(a.getTradesIn("oil")).to.equal(false);
  });

  it ("should update holdings on buy for new holding", () => {

      let a = new Agent();
      let c = new Commodity("Wood", 1, 2.1);
      let cash = a._cash;

      a.buy(c, 100, 1);

      expect(a._cash).to.equal(cash - 100);
      expect(a._holdings).to.contain.all.keys(["Wood"]);
      expect(a._holdings["Wood"].qty).to.equal(100);
  });

  it ("should update holdings on buy", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a.buy(c, 100, 1);
    a.buy(c, 100, 1);

    expect(a._cash).to.equal(cash - 200);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(200);
  });

  it ("should update holdings on sell", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a._holdings = {"Wood": {qty: 100, purchase: []}};

    a.sell(c, 50, 1);

    expect(a._cash).to.equal(cash + 50);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(50);
  });

  it ("should update holdings on sell if key doesn't exist", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a.sell(c, 100, 1);

    expect(a._cash).to.equal(cash);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(0);
  });

  it ("should limit buy to available money", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);

    a.buy(c, 1000000, 1);

    expect(a._cash).to.equal(0);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(50000);
  });

  it ("should ignore buy with negative quantity", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a.buy(c, -1000000, 1);

    expect(a._cash).to.equal(cash);
    expect(a._holdings).to.not.contain.any.keys(["Wood"]);
  });

  it ("should limit sell to available quantity", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a._holdings = {"Wood": {qty: 100, purchase: []}};

    a.sell(c, 150, 1);

    expect(a._cash).to.equal(cash + 100);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(0);
  });

  it ("should ignore sell with negative quantity", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;
    a._holdings = {"Wood": {qty: 100, purchase: []}};

    a.sell(c, -100, 1);

    expect(a._cash).to.equal(cash);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"].qty).to.equal(100);
  });

  it ("should recommend hold if price == moving average", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    c.movingAverage = 1;

    expect(a.getAction(c)).to.equal(0);
  });

  it ("should recommend buy if price < than moving average", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    a._cash = 100;
    c.movingAverage = 5;

    expect(a.getAction(c)).to.be.at.least(1);
  });

  it ("should not recommend buy if price < than moving average and has no cash", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    a._cash = 0;
    c.movingAverage = 5;

    expect(a.getAction(c)).to.equal(0);
  });

  it ("should not recommend sell if price > moving average and has no stock", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 5, 2.1);
    a._cash = 100;
    a._holdings = { "Wood": { qty: 0, purchase: [] } }
    c.movingAverage = 1;

    expect(a.getAction(c)).to.equal(0);
  });

  it ("should not recommend sell if price < all purchase pricess", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 5, 2.1);
    a._cash = 100;
    a._holdings = { "Wood": { qty: 100, purchase: [
      { qty: 100, price: 6 }
    ]}};
    c.movingAverage = 1;

    expect(a.getAction(c)).to.equal(0);
  });

  it ("should recommend sell for holding price > purchase prices", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 5, 2.1);
    a._cash = 100;
    a._holdings = { "Wood": { qty: 150, purchase: [
      { qty: 100, price: 6 },
      { qty: 50, price: 4 }
    ]}};
    c.movingAverage = 1;

    expect(a.getAction(c)).to.equal(-50);
  });

  it ("should recommend hold if not in tradeable commodities", () => {
    let a = new Agent(["Wood"]);
    let c = new Commodity("Paper", 1, 2.1);
    a._cash = 100;
    a._holdings = { "Wood": { qty: 0, purchase: [] } }
    c.movingAverage = 5;

    expect(a.getAction(c)).to.equal(0);
  });

  it ("should handle null being passed to update", () => {
    let a = new Agent();
    a.update();
    expect(true).to.be.true;
  });

  it ("should buy a random percentage of cash when above 50% of starting cash", () => {
      let a = new Agent();
      let c = new Commodity("Wood", 5, 2.1);
      c.movingAverage = 6;

      a.update([c]);
      expect(a._cash).to.be.at.least(1);
  });

  it ("should trade all cash when under 50% of starting cash", () => {
    let a = new Agent([], 10000);
    a._cash = 4000;
    let c = new Commodity("Wood", 5, 2.1);
    c.movingAverage = 6;

    a.update([c]);
    expect(a._cash).to.equal(0);
  });

  it ("should perform trades on update", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 5, 2.1);
    c.movingAverage = 6;

    a.update([c]);

    expect(a._holdings["Wood"].qty).to.be.at.least(1);
  });

  it ("should throttle trades by random amount", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 5, 2.1);
    c.movingAverage = 6;

    a.update([c]);
    let holdings = a._holdings["Wood"];

    a.update([c]);

    expect(a._holdings["Wood"]).to.be.deep.equal(holdings);
  });
});
