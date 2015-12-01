import chai from "chai"
const expect = chai.expect;

import { shuffleArray } from "../src/utils";

describe("utils::shuffleArray", () => {
  it ("should return a shuffled copy of the array", () => {
    let a = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    let b = shuffleArray(a);

    expect(a).to.not.deep.equal(b); // has changed

    expect(a.length).to.equal(b.length); // has the same elements, but diff order
    expect(a).to.contain.members(b);
  });
});
