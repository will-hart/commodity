# Commodity

A simple commodity trading simulation.

## Installation

    git clone https://github.com/will-hart/commodity
    cd commodity
    npm install
    npm run build

The compiled source will be in the `dist` directory

## Test

    npm run test

## Usage

    import { Market } from "main";

    let m = new Market();

    // Update the simulation one "frame". Updates commodity prices
    m.update();

    // Sets the likelihood of an event occurring in each frame
    m.setEventLikelihood(0.05);

    // Create ten "AI" agents to populate the market
    m.addAgents(10);

    // Get all the commodities in the market
    let commodities = m.getCommodities();

    // buy or sell a commodity
    commodities[0].buy(100);
    commodities[0].sell(100);

## License

Apache 2.0

## Version history

**0.2.0**

- Agents with buy/sell logic who aim to make a profit
- Improved market event logic to prevent weird combinations
- Price changes immediately on buy/sell (as well as forecast price)
- [FIX] Prevent negative quantities being bought/sold
- [FIX] Commodity prices re-forecast as soon as a market event is applied
- [FIX] Calculation of forecast price related to external events

**0.1.1**

- Add Apache 2.0 license

**0.1.0**

- Commodities and a Market
- Prices change over time
- Temporary events which impact prices
- Buy or sell commodities
