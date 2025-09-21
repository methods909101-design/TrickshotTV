const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Crypto price data cache
let priceCache = {};
let lastPriceUpdate = 0;
const PRICE_CACHE_DURATION = 60000; // 1 minute

// Main crypto assets
const MAIN_ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA'];

// Generate consistent trading data with real price movements
class TradingDataGenerator {
    constructor() {
        this.historicTrades = [];
        this.activeTrades = [];
        this.generateHistoricTrades();
        this.generateActiveTrades();
    }

    async getCurrentPrices() {
        const now = Date.now();
        if (now - lastPriceUpdate > PRICE_CACHE_DURATION) {
            try {
                // Using CoinGecko API for real prices
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: 'bitcoin,ethereum,solana,binancecoin,cardano',
                        vs_currencies: 'usd'
                    }
                });

                priceCache = {
                    'BTC': response.data.bitcoin?.usd || 67000,
                    'ETH': response.data.ethereum?.usd || 2600,
                    'SOL': response.data.solana?.usd || 140,
                    'BNB': response.data.binancecoin?.usd || 580,
                    'ADA': response.data.cardano?.usd || 0.45
                };
                lastPriceUpdate = now;
            } catch (error) {
                console.log('Using fallback prices due to API error');
                priceCache = {
                    'BTC': 67000,
                    'ETH': 2600,
                    'SOL': 140,
                    'BNB': 580,
                    'ADA': 0.45
                };
            }
        }
        return priceCache;
    }

    generateHistoricTrades() {
        const now = new Date();
        let winCount = 0;
        const totalTrades = 142;
        const targetWinRate = 0.673;
        
        for (let i = 0; i < totalTrades; i++) {
            const asset = MAIN_ASSETS[Math.floor(Math.random() * MAIN_ASSETS.length)];
            const signal = Math.random() > 0.5 ? 'LONG' : 'SHORT';
            const leverage = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
            const hoursAgo = Math.floor(Math.random() * 168) + 1; // 1-7 days ago
            const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
            
            // Determine if this should be a win based on target win rate
            const remainingTrades = totalTrades - i;
            const remainingWinsNeeded = Math.round(totalTrades * targetWinRate) - winCount;
            const shouldWin = remainingWinsNeeded > 0 && (remainingWinsNeeded >= remainingTrades || Math.random() < 0.7);
            
            if (shouldWin) winCount++;
            
            const basePrice = this.getHistoricalPrice(asset, hoursAgo);
            const entryPrice = basePrice * (1 + (Math.random() - 0.5) * 0.02); // ±1% from base
            
            let pnlPercent, exitPrice;
            if (shouldWin) {
                // Average win: +8.7% base return
                const baseReturn = 0.087 + (Math.random() - 0.5) * 0.1; // 3.7% to 13.7%
                pnlPercent = baseReturn * 100 * leverage;
                exitPrice = signal === 'LONG' 
                    ? entryPrice * (1 + baseReturn)
                    : entryPrice * (1 - baseReturn);
            } else {
                // Average loss: -3.8% base return
                const baseReturn = -(0.038 + Math.random() * 0.04); // -3.8% to -7.8%
                pnlPercent = baseReturn * 100 * leverage;
                exitPrice = signal === 'LONG' 
                    ? entryPrice * (1 + baseReturn)
                    : entryPrice * (1 - baseReturn);
            }
            
            this.historicTrades.push({
                id: `historic_${i}`,
                timestamp,
                asset,
                signal,
                entry: entryPrice,
                exit: exitPrice,
                leverage: leverage + 'x',
                pnl: pnlPercent,
                confidence: Math.random() * 30 + 70,
                isWin: shouldWin
            });
        }
        
        this.historicTrades.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`Generated ${totalTrades} historic trades with ${winCount} wins (${(winCount/totalTrades*100).toFixed(1)}% win rate)`);
    }

    generateActiveTrades() {
        const now = new Date();
        const activeCount = Math.floor(Math.random() * 3) + 2; // 2-4 active trades
        
        for (let i = 0; i < activeCount; i++) {
            const asset = MAIN_ASSETS[Math.floor(Math.random() * MAIN_ASSETS.length)];
            const signal = Math.random() > 0.5 ? 'LONG' : 'SHORT';
            const leverage = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
            const hoursAgo = Math.floor(Math.random() * 24) + 1;
            const entryTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
            
            const entryPrice = this.getHistoricalPrice(asset, hoursAgo);
            
            this.activeTrades.push({
                id: `active_${i}`,
                asset,
                signal,
                entry: entryPrice,
                leverage: leverage + 'x',
                confidence: Math.random() * 20 + 75,
                entryTime
            });
        }
    }

    getHistoricalPrice(asset, hoursAgo) {
        const basePrices = {
            'BTC': 67000,
            'ETH': 2600,
            'SOL': 140,
            'BNB': 580,
            'ADA': 0.45
        };
        
        // Simulate price movement over time
        const volatility = {
            'BTC': 0.03,
            'ETH': 0.04,
            'SOL': 0.06,
            'BNB': 0.04,
            'ADA': 0.05
        };
        
        const basePrice = basePrices[asset];
        const dailyChange = (Math.random() - 0.5) * volatility[asset] * 2;
        const daysAgo = hoursAgo / 24;
        
        return basePrice * (1 - dailyChange * daysAgo);
    }

    async getActiveTradesWithCurrentPrices() {
        const currentPrices = await this.getCurrentPrices();
        
        return this.activeTrades.map(trade => {
            const currentPrice = currentPrices[trade.asset];
            const unrealizedPnl = trade.signal === 'LONG' 
                ? ((currentPrice - trade.entry) / trade.entry) * 100 * parseInt(trade.leverage)
                : ((trade.entry - currentPrice) / trade.entry) * 100 * parseInt(trade.leverage);
            
            return {
                ...trade,
                current: currentPrice,
                unrealizedPnl,
                isProfit: unrealizedPnl > 0
            };
        });
    }

    getStatistics() {
        const totalTrades = this.historicTrades.length;
        const wins = this.historicTrades.filter(t => t.isWin).length;
        const winRate = (wins / totalTrades) * 100;
        
        const avgWin = this.historicTrades
            .filter(t => t.isWin)
            .reduce((sum, t) => sum + Math.abs(t.pnl), 0) / wins;
        
        const avgLoss = this.historicTrades
            .filter(t => !t.isWin)
            .reduce((sum, t) => sum + Math.abs(t.pnl), 0) / (totalTrades - wins);
        
        const riskReward = avgWin / avgLoss;
        
        // Calculate more realistic weekly ROI (should be much lower)
        const weeklyTrades = this.historicTrades
            .filter(t => t.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        
        // Realistic weekly ROI calculation - much more conservative
        const weeklyROI = weeklyTrades.length > 0 
            ? weeklyTrades.reduce((sum, t) => sum + (t.pnl / parseInt(t.leverage)), 0) / 10 // Divide by 10 for realism
            : 0;
        
        return {
            winRate: winRate.toFixed(1),
            riskReward: riskReward.toFixed(2),
            weeklyROI: Math.max(0.5, Math.min(8.5, weeklyROI)).toFixed(1), // Cap between 0.5% and 8.5%
            totalSignals: totalTrades
        };
    }
}

const tradingData = new TradingDataGenerator();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/trades', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'trades.html'));
});

app.get('/algorithm', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'algorithm.html'));
});

app.get('/api/statistics', (req, res) => {
    const stats = tradingData.getStatistics();
    res.json(stats);
});

app.get('/api/active-trades', async (req, res) => {
    const activeTrades = await tradingData.getActiveTradesWithCurrentPrices();
    res.json(activeTrades);
});

app.get('/api/historic-trades', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const historicTrades = tradingData.historicTrades.slice(0, limit);
    res.json(historicTrades);
});

app.get('/api/trade/:id', (req, res) => {
    const tradeId = req.params.id;
    let trade = tradingData.historicTrades.find(t => t.id === tradeId);
    
    if (!trade) {
        trade = tradingData.activeTrades.find(t => t.id === tradeId);
    }
    
    if (trade) {
        res.json(trade);
    } else {
        res.status(404).json({ error: 'Trade not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Perpguin server running on http://localhost:${PORT}`);
});
