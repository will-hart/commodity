import Commodity from "./Commodity";
import { getDefaultEvents } from "./MarketEvent";

const defaultMarket = [
  { name: "Wood", price: 40, volatility: 0.1 },
  { name: "Oil", price: 93, volatility: 0.4 }
];


class Market {
  constructor(startingCommodities, events) {
    if (typeof startingCommodities === "undefined" ||
      startingCommodities === null) {
        startingCommodities = defaultMarket;
      }

    if (typeof events === "undefined" ||
      events === null) {
        events = getDefaultEvents();
      }
    this._events = events;
    this._activeEvents = [];

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

    if (Math.random() < this.eventLikelihood) {
      let evtId = Math.floor(Math.random() * this._events.length);
      let evt = this._events[evtId];
      evt.reset();

      if (this._activeEvents.indexOf(evt) === -1) {
        this._activeEvents.push(evt);
        this._commodities.forEach((c) => {
            c.apply(evt);
        });
      }
    }

    this._activeEvents = this._activeEvents.filter((e) => {
      return e.remaining > 0;
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
   * Gets the possible market events
   * @returns {array} and array of Commodity objects
   */
  getEvents() {
    return this._events;
  }

  getActiveEvents() {
    return this._activeEvents;
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
   * Displays a "table" of the current market for debugging
   * @returns {string} a table representation of the current market
   */
  display() {
    let result = "======MARKET======\n";

    this._activeEvents.forEach((e) => {
      result += "EVENT: " + e.description + "\n";
    });

    this._commodities.forEach((c) => {
      result += "COMMODITY: " + c.name + " @ " + c.price + "\n";
    });

    result += "------------------\n\n";

    return result;
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
