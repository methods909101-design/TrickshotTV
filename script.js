// Main JavaScript for Perpguin landing page
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // History Modal functionality
    const modal = document.getElementById('historyModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Consistent trading data storage
    let tradingData = {
        active: [],
        historic: []
    };

    // Main crypto assets we focus on
    const MAIN_ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA'];
    const LEVERAGES = [2, 3, 5, 10];

    // Generate consistent trading data
    function generateTradingData() {
        const now = new Date();
        
        // Generate active trades (2-4 positions)
        const activeCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < activeCount; i++) {
            const asset = MAIN_ASSETS[Math.floor(Math.random() * MAIN_ASSETS.length)];
            const signal = Math.random() > 0.5 ? 'LONG' : 'SHORT';
            const leverage = LEVERAGES[Math.floor(Math.random() * LEVERAGES.length)];
            const hoursAgo = Math.floor(Math.random() * 24) + 1;
            const entryTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
            
            const entryPrice = getCurrentPrice(asset);
            const currentPrice = entryPrice * (1 + (Math.random() - 0.5) * 0.1); // ±5% movement
            
            const unrealizedPnl = signal === 'LONG' 
                ? ((currentPrice - entryPrice) / entryPrice) * 100 * leverage
                : ((entryPrice - currentPrice) / entryPrice) * 100 * leverage;
            
            tradingData.active.push({
                id: `active_${i}`,
                asset,
                signal,
                entry: entryPrice.toFixed(asset === 'BONK' ? 8 : 2),
                current: currentPrice.toFixed(asset === 'BONK' ? 8 : 2),
                leverage: leverage + 'x',
                unrealizedPnl: (unrealizedPnl > 0 ? '+' : '') + unrealizedPnl.toFixed(1) + '%',
                confidence: (Math.random() * 20 + 75).toFixed(1) + '%',
                entryTime,
                isProfit: unrealizedPnl > 0
            });
        }

        // Generate historic trades (last 20 trades)
        for (let i = 0; i < 20; i++) {
            const asset = MAIN_ASSETS[Math.floor(Math.random() * MAIN_ASSETS.length)];
            const signal = Math.random() > 0.5 ? 'LONG' : 'SHORT';
            const leverage = LEVERAGES[Math.floor(Math.random() * LEVERAGES.length)];
            const hoursAgo = Math.floor(Math.random() * 168) + 24; // 1-7 days ago
            const entryTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
            
            const entryPrice = getCurrentPrice(asset);
            const isWin = Math.random() < 0.673; // 67.3% win rate
            
            let pnlPercent, exitPrice;
            if (isWin) {
                // Average win: +8.7% base, multiplied by leverage
                pnlPercent = (Math.random() * 15 + 2) * leverage;
                exitPrice = signal === 'LONG' 
                    ? entryPrice * (1 + pnlPercent / 100 / leverage)
                    : entryPrice * (1 - pnlPercent / 100 / leverage);
            } else {
                // Average loss: -3.8% base, multiplied by leverage
                pnlPercent = -(Math.random() * 6 + 1) * leverage;
                exitPrice = signal === 'LONG' 
                    ? entryPrice * (1 + pnlPercent / 100 / leverage)
                    : entryPrice * (1 - pnlPercent / 100 / leverage);
            }
            
            tradingData.historic.push({
                id: `historic_${i}`,
                timestamp: entryTime,
                asset,
                signal,
                entry: entryPrice.toFixed(asset === 'BONK' ? 8 : 2),
                exit: exitPrice.toFixed(asset === 'BONK' ? 8 : 2),
                leverage: leverage + 'x',
                pnl: (pnlPercent > 0 ? '+' : '') + pnlPercent.toFixed(1) + '%',
                confidence: (Math.random() * 30 + 70).toFixed(1) + '%',
                isWin
            });
        }
        
        tradingData.historic.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Get current price for asset (simulated)
    function getCurrentPrice(asset) {
        const basePrices = {
            'BTC': 67000,
            'ETH': 2600,
            'SOL': 140,
            'BNB': 580,
            'ADA': 0.45
        };
        return basePrices[asset] || 1;
    }

    function formatTimestamp(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / (1000 * 60));
            return diffMins + 'm ago';
        } else if (diffHours < 24) {
            return diffHours + 'h ago';
        } else {
            return diffDays + 'd ago';
        }
    }

    // Populate active trades table
    function populateActiveTrades() {
        const tbody = document.querySelector('#activeTradesTable tbody');
        tbody.innerHTML = '';
        
        tradingData.active.forEach(trade => {
            const row = document.createElement('tr');
            row.dataset.tradeId = trade.id;
            
            const signalClass = trade.signal === 'LONG' ? 'signal-long' : 'signal-short';
            const pnlClass = trade.isProfit ? 'pnl-positive' : 'pnl-negative';
            
            row.innerHTML = `
                <td>${trade.asset}</td>
                <td class="${signalClass}">${trade.signal}</td>
                <td>$${trade.entry}</td>
                <td>$${trade.current}</td>
                <td>${trade.leverage}</td>
                <td class="${pnlClass}">${trade.unrealizedPnl}</td>
                <td>${trade.confidence}</td>
            `;
            
            row.addEventListener('click', () => openTradeModal(trade));
            tbody.appendChild(row);
        });
    }

    // Populate historic trades table
    function populateHistoricTrades() {
        const tbody = document.querySelector('#historicTradesTable tbody');
        tbody.innerHTML = '';
        
        tradingData.historic.slice(0, 10).forEach(trade => {
            const row = document.createElement('tr');
            row.dataset.tradeId = trade.id;
            
            const signalClass = trade.signal === 'LONG' ? 'signal-long' : 'signal-short';
            const pnlClass = trade.isWin ? 'pnl-positive' : 'pnl-negative';
            
            row.innerHTML = `
                <td>${formatTimestamp(trade.timestamp)}</td>
                <td>${trade.asset}</td>
                <td class="${signalClass}">${trade.signal}</td>
                <td>$${trade.entry}</td>
                <td>$${trade.exit}</td>
                <td>${trade.leverage}</td>
                <td class="${pnlClass}">${trade.pnl}</td>
                <td>${trade.confidence}</td>
            `;
            
            row.addEventListener('click', () => openTradeModal(trade));
            tbody.appendChild(row);
        });
    }

    // Open trade modal with TradingView chart
    function openTradeModal(trade) {
        modal.style.display = 'block';
        
        // Update modal content
        document.querySelector('#historyModal h2').textContent = `${trade.asset} ${trade.signal} ANALYSIS`;
        
        // Update confidence indicator
        const confidence = parseFloat(trade.confidence);
        const confidenceIndicator = document.querySelector('.confidence-indicator');
        confidenceIndicator.style.left = `${confidence}%`;
        document.querySelector('.confidence-scale span:last-child').textContent = trade.confidence;
        
        // Replace chart placeholder with TradingView widget
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.innerHTML = `
            <div class="tradingview-widget-container" style="height:100%;width:100%">
                <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                        <span class="blue-text">Track all markets on TradingView</span>
                    </a>
                </div>
            </div>
        `;
        
        // Initialize TradingView widget
        new TradingView.widget({
            "autosize": true,
            "symbol": getSymbolForAsset(trade.asset),
            "interval": "15",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#000000",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": true,
            "save_image": false,
            "container_id": chartContainer.querySelector('.tradingview-widget-container__widget'),
            "studies": [
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies"
            ],
            "overrides": {
                "paneProperties.background": "#000000",
                "paneProperties.vertGridProperties.color": "#333333",
                "paneProperties.horzGridProperties.color": "#333333",
                "symbolWatermarkProperties.transparency": 90,
                "scalesProperties.textColor": "#AAA",
                "mainSeriesProperties.candleStyle.wickUpColor": "#00ff00",
                "mainSeriesProperties.candleStyle.wickDownColor": "#ff4444"
            }
        });
        
        // Add entry/exit markers (simulated)
        setTimeout(() => {
            addTradeMarkers(trade);
        }, 1000);
    }

    // Get TradingView symbol for asset
    function getSymbolForAsset(asset) {
        const symbols = {
            'BTC': 'BINANCE:BTCUSDT',
            'ETH': 'BINANCE:ETHUSDT',
            'SOL': 'BINANCE:SOLUSDT',
            'BNB': 'BINANCE:BNBUSDT',
            'ADA': 'BINANCE:ADAUSDT'
        };
        return symbols[asset] || 'BINANCE:BTCUSDT';
    }

    // Add trade markers to chart (simulated overlay)
    function addTradeMarkers(trade) {
        const chartContainer = document.querySelector('.chart-container');
        const markersDiv = document.createElement('div');
        markersDiv.className = 'trade-markers';
        markersDiv.style.position = 'absolute';
        markersDiv.style.top = '0';
        markersDiv.style.left = '0';
        markersDiv.style.width = '100%';
        markersDiv.style.height = '100%';
        markersDiv.style.pointerEvents = 'none';
        markersDiv.style.zIndex = '10';
        
        // Entry marker
        const entryMarker = document.createElement('div');
        entryMarker.className = 'entry-marker';
        entryMarker.style.left = '25%';
        entryMarker.style.top = '60%';
        entryMarker.title = `Entry: $${trade.entry}`;
        
        // Exit marker (if historic trade)
        if (trade.exit) {
            const exitMarker = document.createElement('div');
            exitMarker.className = 'exit-marker';
            exitMarker.style.left = '75%';
            exitMarker.style.top = trade.isWin ? '30%' : '80%';
            exitMarker.title = `Exit: $${trade.exit}`;
            markersDiv.appendChild(exitMarker);
        }
        
        markersDiv.appendChild(entryMarker);
        chartContainer.appendChild(markersDiv);
    }

    // Simulate live data updates
    function simulateLiveUpdates() {
        const statusDot = document.querySelector('.status-dot');
        if (!statusDot) return;
        
        setInterval(() => {
            const randomDuration = Math.random() * 2 + 1;
            statusDot.style.animationDuration = randomDuration + 's';
        }, 5000);
    }

    // Initialize everything
    function init() {
        generateTradingData();
        populateActiveTrades();
        populateHistoricTrades();
        simulateLiveUpdates();
    }

    // Load TradingView widget script
    function loadTradingViewScript() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = init;
        document.head.appendChild(script);
    }

    // Start initialization
    loadTradingViewScript();

    // Add console message for developers
    console.log(`
    ╔═══════════════════════════════════════╗
    ║              PERPGUIN                 ║
    ║        Automated Perpetuals           ║
    ║            Analyst v1.0               ║
    ║                                       ║
    ║  🐧 AI-driven perpetual futures       ║
    ║     analysis for Solana DeFi          ║
    ║                                       ║
    ║  Built with Jupiter API integration   ║
    ║  lite-api.jup.ag endpoint             ║
    ╚═══════════════════════════════════════╝
    `);
});
