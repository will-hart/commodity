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
      expect(a._holdings["Wood"]).to.equal(100);
  });

  it ("should update holdings on buy", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a.buy(c, 100, 1);
    a.buy(c, 100, 1);

    expect(a._cash).to.equal(cash - 200);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"]).to.equal(200);
  });

  it ("should update holdings on sell", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a._holdings = {"Wood": 100}

    a.sell(c, 50, 1);

    expect(a._cash).to.equal(cash + 50);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"]).to.equal(50);
  });

  it ("should update holdings on sell if key doesn't exist", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a.sell(c, 100, 1);

    expect(a._cash).to.equal(cash);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"]).to.equal(0);
  });

  it ("should limit buy to available money", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);

    a.buy(c, 1000000, 1);

    expect(a._cash).to.equal(0);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"]).to.equal(50000);
  });

  it ("should limit sell to available quantity", () => {
    let a = new Agent();
    let c = new Commodity("Wood", 1, 2.1);
    let cash = a._cash;

    a._holdings = {"Wood": 100}

    a.sell(c, 150, 1);

    expect(a._cash).to.equal(cash + 100);
    expect(a._holdings).to.contain.all.keys(["Wood"]);
    expect(a._holdings["Wood"]).to.equal(0);
  });
});
