# Commodity

A simple commodity trading simulation.

    import { Market } from "main";

    let m = new Market();

    // Update the simulation one "frame". Updates commodity prices
    m.update();

    // Sets the likelihood of an event occurring in each frame
    m.setEventLikelihood(0.05);

    // Get all the commodities in the market
    let commodities = m.getCommodities();

    // buy or sell a commodity
    commodities[0].buy(100);
    commodities[0].sell(100);


## Version history

**0.1**

- Commodities and a Market
- Prices change over time
- Temporary events which impact prices
- Buy or sell commodities
