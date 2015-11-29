const maxStartingPriceMultiplier = 10;
let startingPrice;

class Commodity {
  constructor(price, volatility) {

    // set up initial state
    this.price = price;
    startingPrice = price;
    this.volatility = volatility;
    this.externalForce = 1.0;

    // set up internal price equation
    this.forecastFrequency = 20;
    this.sinceLastForecast = this.forecastFrequency;
    this.forecastPrice = this.price;
  }

  /**
   * Update the price based on the target price determined
   * by forecast as well as some noise proportional to volatility
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
  }

  /**
   * Sets an external market force, to represent things like
   * shortages or random external conditions which modify price
   */
  setExternalForce(force) {
    if (typeof(force) === "undefined" || force === null) {
      this.externalForce = 1.0;
    } else {
      this.externalForce = force;
    }
  }

  /**
   * Determines a new forecast price and period.
   * The price depends on volatility
   */
  _forecast() {
    // calculate equation for end of period value
    let current = this.price;
    let deltaRange = this.volatility * this.price;
    let delta = this.externalForce *
      (Math.random() * 2 * deltaRange - deltaRange);
    let forecast = this.price + delta;

    // clamp to 0.1 to a multiple of the starting price
    forecast = Math.max(0.0,
      Math.min(forecast, startingPrice * maxStartingPriceMultiplier));

    // commit the forecast
    this.forecastPrice = forecast;

    // calculate new forecast period 10 to 50 periods
    this.forecastFrequency = Math.floor(
      Math.random() * 40 + 10);
    this.sinceLastForecast = 0;
  }
}

export default Commodity;
