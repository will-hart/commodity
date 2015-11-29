class MarketEvent {
  constructor(commodityName, priceImpact, duration) {
    this.commodity = commodityName;
    this.price = priceImpact;
    this.duration = duration;
      this.remaining = this.duration;
  }

  update() {
    this.remaining--;
  }
}

export default MarketEvent;
