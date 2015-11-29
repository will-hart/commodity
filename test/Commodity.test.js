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
    c.update();
    expect(c.price).to.not.equal(1.0);
  });

  it ("should reset external force to 1 on no arg passed", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    c.setExternalForce();
    expect(c.externalForce).to.equal(1);
  });

  it ("should store external force", () => {
    let c = new Commodity("Wood", 1.0, 2.1);
    c.setExternalForce(-3);
    expect(c.externalForce).to.equal(-3);
  });
});
