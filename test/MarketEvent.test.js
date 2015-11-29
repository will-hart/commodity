import chai from "chai";
const expect = chai.expect;

import { MarketEvent } from "../src/MarketEvent"
import Commodity from "../src/Commodity"

describe("MarketEvent", () => {
  it("should set parameters in constructor", () => {
    var m = new MarketEvent("wood", 0.1, 7);
    expect(m.commodity).to.equal("wood");
    expect(m.price).to.equal(0.1);
    expect(m.duration).to.equal(7);
    expect(m.remaining).to.equal(7);
  });

  it("should decrement remaining on update", () => {
      var m = new MarketEvent("wood", 0.1, 7);
      m.update();
      expect(m.remaining).to.equal(6);
  });
});

describe("Commodity <> MarketEvent", () => {
  it ("should not apply a market event with a different commodity", () => {
    var c = new Commodity("Wood", 1.0, 0.1);
    var me = new MarketEvent("fred", -2.0, 5);
    var me2 = new MarketEvent("Wood", -2.0, 5);

    c.apply(me);
    c.apply(me2);

    expect(c.externalForce).to.equal(-1);
  });

  it ("should apply a market event to a commodity", () => {
    var c = new Commodity("Wood", 1.0, 0.1);
    var me = new MarketEvent("Wood", -2.0, 5);

    c.apply(me);

    expect(c.externalForce).to.equal(-1);
  });

  it ("should expire MarketEvents when duration is zero", () => {
    var c = new Commodity("Wood", 1.0, 0.1);
    var me = new MarketEvent("Wood", -2.0, 5);
    var me2 = new MarketEvent("Wood", -2.0, 50);

    c.apply(me);
    c.apply(me2);

    for (var i = 0; i < 5; ++i) {
      c.update();
    }

    expect(c.externalForce).to.equal(-1);
  });
});
