# TrickshotTV - Perpguin Project

AI-Driven Perpetual Futures Analysis For Major Cryptocurrencies with Live Alerts Available On Twitter.

## Overview

Perpguin is a trading bot that analyzes cryptocurrency markets and posts trading signals on Twitter. The system combines technical analysis, sentiment processing, and order flow data to identify high-probability trading opportunities in perpetual futures markets.

## Features

- **Real-time Analysis**: Monitors price movements, technical indicators, and market sentiment
- **Live Intelligence**: Continuously pulls data from news sources, Twitter sentiment, Reddit discussions, and influencer posts
- **Automated Signals**: Posts trading signals to Twitter with entry points, targets, and stop losses
- **Performance Tracking**: Maintains ~67% win rate with 1.84:1 risk/reward ratio
- **Transparent Results**: Public record of all signals on Twitter - no cherry-picking

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Styling**: Custom CSS with JetBrains Mono font
- **APIs**: CoinGecko for live price data
- **Real-time Data**: Jupiter API integration for Solana perpetuals

## Project Structure

```
TrickshotTV/
├── public/
│   ├── index.html          # Main homepage
│   ├── algorithm.html      # Algorithm details page
│   ├── styles.css          # Main stylesheet
│   ├── script.js           # Frontend JavaScript
│   └── assets/             # Images and icons
├── server.js               # Node.js backend server
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/methods909101-design/TrickshotTV.git
cd TrickshotTV
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Homepage Features
- **Current Statistics**: Live performance metrics
- **Sample Tweet**: Example of trading signal format
- **Algorithm Overview**: Detailed explanation of the system

### Algorithm Page
- **Technical Components**: Code snippets showing core functionality
- **Signal Generation**: Main algorithm for trade identification
- **Sentiment Analysis**: Real-time news and social media processing
- **Technical Analysis**: Order flow and volume analysis

## API Endpoints

- `GET /` - Homepage
- `GET /algorithm` - Algorithm details page
- `GET /api/statistics` - Current performance statistics
- `GET /api/active-trades` - Currently active trades
- `GET /api/historic-trades` - Historical trade data

## Trading Signal Format

```
PERPGUIN SIGNAL #142 | 🟢 $SOL LONG

ENTRY - $142.50
TARGET - $148.75 (+4.4%)
STOP - $138.20 (-3.0%)

⚡ LEVERAGE: 45x

PERPGUIN ANALYSIS: Strong bullish momentum with RSI oversold bounce and volume confirmation. Key resistance break at $143 signals continuation to $148 target.
```

## Performance Metrics

- **Win Rate**: 67.3% (7-day average)
- **Risk/Reward Ratio**: 1.84:1
- **Focus Assets**: BTC, ETH, SOL, BNB, ADA
- **Signal Frequency**: Multiple signals per day

## Social Media

- **Twitter**: [@perpguin](https://x.com/perpguin) - Live trading signals
- **Website**: Real-time performance tracking and algorithm details

## Important Disclaimer

This is an experimental project for educational purposes only. The algorithm is continuously being improved. Please:

- Use signals for educational purposes only
- Always do your own research
- Never risk more than you can afford to lose
- Trading perpetual futures involves significant risk

## Development

### Scripts
- `npm run dev` - Start development server
- `npm start` - Start production server

### Key Files
- `server.js` - Main backend application
- `public/index.html` - Homepage template
- `public/algorithm.html` - Algorithm page template
- `public/styles.css` - Main stylesheet
- `public/script.js` - Frontend functionality

## Future Plans

- Expand to more cryptocurrency assets
- Improve signal accuracy and confidence scoring
- Develop fully automated system with adaptive market conditions
- Enhanced risk management features
- Mobile application development

## Contributing

This is currently a personal project, but feedback and suggestions are welcome through GitHub issues.

## License

This project is for educational and demonstration purposes. Please refer to the disclaimer above regarding trading risks.

---

**Built with ❤️ for the crypto trading community**

*Follow [@perpguin](https://x.com/perpguin) on Twitter for live trading signals*
