import Commodity from "./Commodity";

const defaultMarket = [
  { name: "Wood", price: "40", volatility: "0.1" },
  { name: "Oil", price: "93", volatility: "0.4" }
];

class Market {
  constructor(startingCommodities) {
    if (typeof startingCommodities === "undefined" ||
      startingCommodities === null) {
        startingCommodities = defaultMarket;
      }

    this._commodities = [];
    this._buildMarket(startingCommodities);

    this.eventLikelihood = 0; // no events unless requested
  }

  /**
   * Updates all the commodities
   * @returns {array} and array of Commodity objects
   */
  update() {
    this._commodities.forEach((c) => {
      c.update();
    });
  }

  /**
   * Gets the market commodities
   * @returns {array} and array of Commodity objects
   */
  getCommodities() {
    return this._commodities;
  }

  /**
   * Sets the likelihood of events occurring on each update
   * @param {number} likelihood the 0-1 likelihood of an event occuring in update
   * @returns {null} nothing
   */
  setEventLikelihood(likelihood) {
    this.eventLikelihood = likelihood;
  }

  /**
   * Builds the market from the given commodity description
   * @param {array} comms An array of commodity descriptions { name: , price: volatility: }
   * @returns {null} nothing
   */
  _buildMarket(comms) {
    this._commodities = comms.map((c) => {
      return new Commodity(c.name, c.price, c.volatility);
    });
  }
}

export default Market;
