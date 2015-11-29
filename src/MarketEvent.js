class MarketEvent {
  constructor(commodityName, priceImpact, duration,
    description = "Unknown event",
    showNotification = false) {
      this.commodity = commodityName;
      this.price = priceImpact;
      this.duration = duration;
      this.remaining = this.duration;
      this.description = description;
      this.showNotification = showNotification;
  }

  update() {
    this.remaining--;
  }
}

const getDefaultEvents = () => {
  return [
    new MarketEvent("Wood", 0.05, 30, "Wood shortage", true),
    new MarketEvent("Wood", 0.1, 25, "Large wood shortage", true),
    new MarketEvent("Wood", -0.05, 30, "Wood oversupply", true),
    new MarketEvent("Wood", -0.1, 25, "Large  wood oversupply", true),
    new MarketEvent("Oil", 0.05, 30, "Oil shortage", true),
    new MarketEvent("Oil", 0.1, 25, "Large oil shortage", true),
    new MarketEvent("Oil", -0.05, 30, "Oil oversupply", true),
    new MarketEvent("Oil", -0.1, 25, "Large oil oversupply", true)
  ];
};

export {
  getDefaultEvents,
  MarketEvent
};
