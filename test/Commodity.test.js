import chai from "chai"
const expect = chai.expect;

import Commodity from "../src/Commodity"
import { MarketEvent } from "../src/MarketEvent"

describe("Commodity", () => {
  it ("should set price in constructor", () => {
    let c = new Commodity("Wood", 1, 2.1);
    expect(c.price).to.equal(1);
  });

  it ("should set volatility in constructor", () => {
    let c = new Commodity("Wood", 1, 2.1);
    expect(c.volatility).to.equal(2.1);
  });

  it ("should set name in constructor", () => {
    let c = new Commodity("Wood", 1, 2.1);
    expect(c.name).to.equal("Wood");
  });

  it ("should produce new prices on update", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    let price = c.price;
    c.update();
    expect(c.price).to.not.equal(price);
  });

  it ("should reset external force to 1 on no arg passed", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    c._addExternalForce();
    expect(c.externalForce).to.equal(1);
  });

  it ("should store external force", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    c._addExternalForce(-1);
    c._addExternalForce(-3.5);
    expect(c.externalForce).to.equal(-3.5);
  });

  it ("should reforecast after external force applied", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    let forecast = c.forecastPrice;

    let me = new MarketEvent("Wood", 0.05, 30, "Wood shortage", true)
    c.apply(me);

    expect(c.forecastPrice).to.not.equal(forecast);
  });

  it ("should allow purchase", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    expect(c.buy(100)).to.equal(100);
  });

  it ("should reject negative buy quantities", () => {
    let c = new Commodity("Wood", 100, 0.2);
    expect(c.buy(-100)).to.equal(0);
  })

  it ("should reject negative sell quantities", () => {
    let c = new Commodity("Wood", 100, 0.2);
    expect(c.sell(-100)).to.equal(0);
  })

  it ("should increase price following purchase", () => {
    let c = new Commodity("Wood", 100, 0.2);
    const price = c.price;

    c.buy(100);
    expect(c.price).to.be.greaterThan(price);
  });

  it ("should decrease price following purchase", () => {
    let c = new Commodity("Wood", 100, 0.2);
    const price = c.price;

    c.sell(100);
    expect(c.price).to.be.lessThan(price);
  });

  it ("should increase forecast price following purchase", () => {
    let c = new Commodity("Wood", 100, 0.2);
    const forecastPrice = c.forecastPrice;

    c.buy(100);
    expect(c.forecastPrice).to.be.greaterThan(forecastPrice);
  });

  it ("should decrease forecast price following purchase", () => {
    let c = new Commodity("Wood", 100, 0.2);
    const forecastPrice = c.forecastPrice;

    c.sell(100);
    expect(c.forecastPrice).to.be.lessThan(forecastPrice);
  });

  it ("should retain price history", () => {
    let c = new Commodity("Wood", 100, 0.2);
    for (let i = 0; i < 100; ++i) {
      c.update();
    }

    expect(c.getHistory().length).to.equal(50);
  });

  it ("should calculate moving average of history", () => {
    let c = new Commodity("Wood", 100, 0.2);
    for (let i = 0; i < 100; ++i) {
      c.update();
    }

    expect(c.movingAverage).to.not.equal(0);
  });

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
