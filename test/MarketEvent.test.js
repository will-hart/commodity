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

  it ("should reset remaining", () => {
    var me = new MarketEvent("Wood", -2.0, 5);

    me.update();
    me.update();

    me.reset();

    expect(me.remaining).to.equal(5);
  });
});
