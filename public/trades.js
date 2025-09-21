// JavaScript for Perpguin trades page
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('tradeModal');
    const closeBtn = document.querySelector('.close');
    let allHistoricTrades = [];

    // Modal functionality
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Load statistics and update overview
    async function loadStatistics() {
        try {
            const response = await fetch('/api/statistics');
            const stats = await response.json();
            
            document.getElementById('totalTrades').textContent = stats.totalSignals;
            document.getElementById('winRate').textContent = stats.winRate + '%';
            document.getElementById('riskReward').textContent = stats.riskReward + ':1';
            document.getElementById('weeklyROI').textContent = '+' + stats.weeklyROI + '%';
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    // Load and display active trades
    async function loadActiveTrades() {
        try {
            const response = await fetch('/api/active-trades');
            const trades = await response.json();
            populateActiveTradesTable(trades);
        } catch (error) {
            console.error('Error loading active trades:', error);
        }
    }

    // Load and display historic trades
    async function loadHistoricTrades() {
        try {
            const response = await fetch('/api/historic-trades?limit=25');
            const trades = await response.json();
            allHistoricTrades = trades;
            populateHistoricTradesTable(trades);
        } catch (error) {
            console.error('Error loading historic trades:', error);
        }
    }

    function populateActiveTradesTable(trades) {
        const tbody = document.querySelector('#activeTradesTable tbody');
        tbody.innerHTML = '';
        
        trades.forEach(trade => {
            const row = document.createElement('tr');
            row.dataset.tradeId = trade.id;
            
            const signalClass = trade.signal === 'LONG' ? 'signal-long' : 'signal-short';
            const pnlClass = trade.isProfit ? 'pnl-positive' : 'pnl-negative';
            const duration = formatTimestamp(trade.entryTime);
            
            row.innerHTML = `
                <td>${trade.asset}</td>
                <td class="${signalClass}">${trade.signal}</td>
                <td>$${formatPrice(trade.entry, trade.asset)}</td>
                <td>$${formatPrice(trade.current, trade.asset)}</td>
                <td>${trade.leverage}</td>
                <td class="${pnlClass}">${trade.unrealizedPnl > 0 ? '+' : ''}${trade.unrealizedPnl.toFixed(1)}%</td>
                <td>${trade.confidence.toFixed(1)}%</td>
                <td>${duration}</td>
            `;
            
            row.addEventListener('click', () => openTradeModal(trade));
            tbody.appendChild(row);
        });
    }

    function populateHistoricTradesTable(trades) {
        const tbody = document.querySelector('#historicTradesTable tbody');
        tbody.innerHTML = '';
        
        trades.forEach(trade => {
            const row = document.createElement('tr');
            row.dataset.tradeId = trade.id;
            
            const signalClass = trade.signal === 'LONG' ? 'signal-long' : 'signal-short';
            const pnlClass = trade.isWin ? 'pnl-positive' : 'pnl-negative';
            
            row.innerHTML = `
                <td>${formatTimestamp(trade.timestamp)}</td>
                <td>${trade.asset}</td>
                <td class="${signalClass}">${trade.signal}</td>
                <td>$${formatPrice(trade.entry, trade.asset)}</td>
                <td>$${formatPrice(trade.exit, trade.asset)}</td>
                <td>${trade.leverage}</td>
                <td class="${pnlClass}">${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(1)}%</td>
                <td>${trade.confidence.toFixed(1)}%</td>
            `;
            
            row.addEventListener('click', () => openTradeModal(trade));
            tbody.appendChild(row);
        });
    }

    function formatPrice(price, asset) {
        if (asset === 'ADA') {
            return parseFloat(price).toFixed(3);
        } else if (asset === 'BTC') {
            return parseFloat(price).toLocaleString();
        } else {
            return parseFloat(price).toFixed(2);
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
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

    function openTradeModal(trade) {
        modal.style.display = 'block';
        
        // Update modal title
        document.getElementById('modalTitle').textContent = `${trade.asset} ${trade.signal} ANALYSIS`;
        
        // Update confidence indicator
        const confidence = parseFloat(trade.confidence);
        const confidenceIndicator = document.getElementById('confidenceIndicator');
        confidenceIndicator.style.left = `${confidence}%`;
        document.getElementById('confidenceValue').textContent = `${confidence.toFixed(1)}%`;
        
        // Load TradingView chart
        loadTradingViewChart(trade);
        
        // Update trade details
        updateTradeDetails(trade);
    }

    function loadTradingViewChart(trade) {
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.innerHTML = '';
        
        // Create TradingView widget
        new TradingView.widget({
            autosize: true,
            symbol: getSymbolForAsset(trade.asset),
            interval: '15',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#000000',
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: true,
            save_image: false,
            container_id: chartContainer,
            studies: [
                'RSI@tv-basicstudies',
                'MACD@tv-basicstudies'
            ],
            overrides: {
                'paneProperties.background': '#000000',
                'paneProperties.vertGridProperties.color': '#333333',
                'paneProperties.horzGridProperties.color': '#333333',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.textColor': '#AAA',
                'mainSeriesProperties.candleStyle.wickUpColor': '#00ff00',
                'mainSeriesProperties.candleStyle.wickDownColor': '#ff4444'
            }
        });
        
        // Add entry/exit markers after chart loads
        setTimeout(() => {
            addTradeMarkers(trade);
        }, 2000);
    }

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

    function addTradeMarkers(trade) {
        const chartContainer = document.getElementById('chartContainer');
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
        entryMarker.title = `Entry: $${formatPrice(trade.entry, trade.asset)}`;
        
        // Exit marker (if historic trade)
        if (trade.exit) {
            const exitMarker = document.createElement('div');
            exitMarker.className = 'exit-marker';
            exitMarker.style.left = '75%';
            exitMarker.style.top = trade.isWin ? '30%' : '80%';
            exitMarker.title = `Exit: $${formatPrice(trade.exit, trade.asset)}`;
            markersDiv.appendChild(exitMarker);
        }
        
        markersDiv.appendChild(entryMarker);
        chartContainer.appendChild(markersDiv);
    }

    function updateTradeDetails(trade) {
        const detailsContainer = document.getElementById('tradeDetails');
        
        let detailsHTML = `
            <div class="trade-info">
                <h4>Trade Information</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Asset:</span>
                        <span class="info-value">${trade.asset}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Signal:</span>
                        <span class="info-value ${trade.signal === 'LONG' ? 'signal-long' : 'signal-short'}">${trade.signal}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Entry Price:</span>
                        <span class="info-value">$${formatPrice(trade.entry, trade.asset)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Leverage:</span>
                        <span class="info-value">${trade.leverage}</span>
                    </div>
        `;
        
        if (trade.current) {
            detailsHTML += `
                    <div class="info-item">
                        <span class="info-label">Current Price:</span>
                        <span class="info-value">$${formatPrice(trade.current, trade.asset)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Unrealized PnL:</span>
                        <span class="info-value ${trade.isProfit ? 'pnl-positive' : 'pnl-negative'}">${trade.unrealizedPnl > 0 ? '+' : ''}${trade.unrealizedPnl.toFixed(1)}%</span>
                    </div>
            `;
        }
        
        if (trade.exit) {
            detailsHTML += `
                    <div class="info-item">
                        <span class="info-label">Exit Price:</span>
                        <span class="info-value">$${formatPrice(trade.exit, trade.asset)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Realized PnL:</span>
                        <span class="info-value ${trade.isWin ? 'pnl-positive' : 'pnl-negative'}">${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(1)}%</span>
                    </div>
            `;
        }
        
        detailsHTML += `
                </div>
            </div>
        `;
        
        detailsContainer.innerHTML = detailsHTML;
    }

    // Initialize page
    loadStatistics();
    loadActiveTrades();
    loadHistoricTrades();
    
    // Refresh active trades every 30 seconds
    setInterval(loadActiveTrades, 30000);
});
