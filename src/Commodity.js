class Commodity {
  constructor(name, price, volatility) {

    // set up initial state
    this.name = name;
    this.price = price;
    this._startingPrice = price;
    this.volatility = volatility;
    this.externalForce = 1.0;

    // set up internal price equation
    this.forecastFrequency = 20;
    this.sinceLastForecast = this.forecastFrequency;
    this.forecastPrice = this.price;

    this._marketEvents = [];
    this._maxStartingPriceMultiplier = 10;

    this._forecast();
  }

  /**
   * Update the price based on the target price determined
   * by forecast as well as some noise proportional to volatility
   * @returns {null} nothing
   */
  update() {
    if (this.sinceLastForecast >= this.forecastFrequency) {
      this._forecast();
    }

    // determine expected value by interpolating between here
    // and the target
    let xFactor = this.sinceLastForecast / this.forecastFrequency;
    let yScale = this.forecastPrice - this.price;
    let volatilityEffect = this.volatility * (Math.random() * 0.3 - 0.15);
    let expected = this.price + yScale * xFactor + volatilityEffect;

    if (expected < 0.1) {
      expected = 0.1;
    }

    this.sinceLastForecast++;
    this.price = expected;

    // filter out market events that have expired
    this._marketEvents.forEach((me) => {
      me.update();

      if (me.remaining <= 0) {
        this.addExternalForce(-me.price);
      }
    });

    this._marketEvents = this._marketEvents.filter((me) => {
      return me.remaining > 0;
    });
  }

  apply(marketEvent) {
    if (marketEvent.commodity !== this.name) {
      return;
    }

    this._marketEvents.push(marketEvent);
    this.addExternalForce(marketEvent.price);
  }

  /**
   * Adds an external market force, to represent things like
   * shortages or random external conditions which modify price
   * @param {number} force the multiplier to add to price movements
   * @returns {null} nothing
   */
  addExternalForce(force) {
    if (typeof force === "undefined" || force === null) {
      this.externalForce = 1.0;
    } else {
      this.externalForce += force;
    }
  }

  /**
   * Purchases the given quantity at the given price
   * @param {number} quantity the quantity to purchase
   * @returns {number} the quantity purchased
   */
  buy(quantity) {
    if (quantity < 0) {
      return 0;
    }

    let forecastFactor = Math.min(1.1, 1 + quantity / 1000);
    this.forecastPrice *= forecastFactor;

    let priceFactor = Math.min(1.1, 1 + quantity / 100000);
    this.price *= priceFactor;

    return quantity;
  }

  /**
   * Sells the given quantity at the given price
   * @param {number} quantity the quantity to sell
   * @returns {number} the quantity sold
   */
  sell(quantity) {
    if (quantity < 0) {
      return 0;
    }

    let forecastFactor = Math.max(0.9, 1 - quantity / 1000);
    this.forecastPrice *= forecastFactor;

    let priceFactor = Math.max(0.98, 1 - quantity / 100000);
    this.price *= priceFactor;

    return quantity;
  }

  /**
   * Determines a new forecast price and period.
   * The price depends on volatility
   * @returns {null} nothing
   */
  _forecast() {
    // calculate equation for end of period value
    let deltaRange = this.volatility * this.price;
    let delta = this.externalForce *
      (Math.random() * 2 * deltaRange - deltaRange);
    let forecast = this.price + delta;

    // clamp to 0.1 to a multiple of the starting price
    forecast = Math.max(0.0,
      Math.min(forecast, this._startingPrice * this._maxStartingPriceMultiplier));

    // commit the forecast
    this.forecastPrice = forecast;

    // calculate new forecast period 10 to 50 periods
    this.forecastFrequency = Math.floor(
      Math.random() * 40 + 10);
    this.sinceLastForecast = 0;
  }
}

export default Commodity;
