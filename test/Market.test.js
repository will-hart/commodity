import chai from "chai"
const expect = chai.expect;

import Market from "../src/Market"

describe("Market", () => {
  it("should set default commodities if none given to constructor", () => {
    var m = new Market();
    expect(m.getCommodities().length).to.equal(2);
  });

  it("should set the passed commodities if given to constructor", () => {
    var m = new Market([
      { name: "wood", price: 1, volatility: 0.1 }
    ]);
    expect(m.getCommodities().length).to.equal(1);
  });

  it ("should have a default event likelihood of 0", () => {
    var m = new Market();
    expect(m.eventLikelihood).to.equal(0);
  });

  it ("should set event likelihood", () => {
    var m = new Market();
    m.setEventLikelihood(0.5);
    expect(m.eventLikelihood).to.equal(0.5);
  });

  it ("should update all commodities on update", () => {
    var m = new Market();
    var cs = JSON.parse(JSON.stringify(m.getCommodities()));
    m.update();

    expect(cs).to.not.deep.equal(
      JSON.parse(
        JSON.stringify(m.getCommodities())
      )
    );
  });
});
