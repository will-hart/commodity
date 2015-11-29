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

    // Get all the commodities in the market
    let commodities = m.getCommodities();

    // buy or sell a commodity
    commodities[0].buy(100);
    commodities[0].sell(100);

## License

Apache 2.0

## Version history

**0.1.1**

- Add Apache 2.0 license

**0.1.0**

- Commodities and a Market
- Prices change over time
- Temporary events which impact prices
- Buy or sell commodities
