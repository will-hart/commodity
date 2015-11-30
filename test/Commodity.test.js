import chai from "chai"
const expect = chai.expect;

import Commodity from "../src/Commodity"

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
    c.addExternalForce();
    expect(c.externalForce).to.equal(1);
  });

  it ("should store external force", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    c.addExternalForce(-1);
    c.addExternalForce(-3.5);
    expect(c.externalForce).to.equal(-3.5);
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
});
