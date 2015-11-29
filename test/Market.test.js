import chai from "chai";
const expect = chai.expect;

import Market from "../src/Market";
import { MarketEvent } from "../src/MarketEvent";

describe("Market", () => {
  it("should set default commodities if none given to constructor", () => {
    let m = new Market();
    expect(m.getCommodities().length).to.equal(2);
  });

  it("should set the passed commodities if given to constructor", () => {
    let m = new Market([
      { name: "wood", price: 1, volatility: 0.1 }
    ]);
    expect(m.getCommodities().length).to.equal(1);
  });

  it("should set default market events if none given to constructor", () => {
    let m = new Market();
    expect(m.getEvents().length).to.be.at.least(1);
  });

  it("should set the passed market events if given to constructor", () => {
    let m = new Market(null, [
      new MarketEvent("Wood", 0.05, 30, "Wood shortage", true)
    ]);
    expect(m.getEvents().length).to.equal(1);
  });

  it ("should have a default event likelihood of 0", () => {
    let m = new Market();
    expect(m.eventLikelihood).to.equal(0);
  });

  it ("should set event likelihood", () => {
    let m = new Market();
    m.setEventLikelihood(0.5);
    expect(m.eventLikelihood).to.equal(0.5);
  });

  it ("should update all commodities on update", () => {
    let m = new Market();
    let cs = JSON.parse(JSON.stringify(m.getCommodities()));
    m.update();

    expect(cs).to.not.deep.equal(
      JSON.parse(
        JSON.stringify(m.getCommodities())
      )
    );
  });

  it ("should not generate events if likelihood is 0", () => {
    const numTests = 100;

    let m = new Market();
    let numEvents = 0;

    for (let i = 0; i < numTests; ++i) {
      m.update();
      numEvents += m.getActiveEvents().length;
    }

    expect(numEvents).to.equal(0);
  });

  it ("should generate events if likelihood > 0", () => {
    const numTests = 100;

    let m = new Market();
    let numEvents = 0;

    m.setEventLikelihood(0.1);
    for (let i = 0; i < numTests; ++i) {
      m.update();
      numEvents += m.getActiveEvents().length;
    }

    expect(numEvents).to.be.at.least(1);
    expect(numEvents).to.be.below(numTests * m._events.length);
  });
});
