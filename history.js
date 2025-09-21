// Generate fake trading data for the past 7 days
function generateTradingHistory() {
    const assets = ['SOL', 'BONK', 'WIF', 'PYTH', 'JUP', 'RAY', 'ORCA', 'MNGO', 'SRM', 'FIDA'];
    const signals = ['LONG', 'SHORT'];
    const leverages = [2, 3, 5, 10];
    
    const trades = [];
    const now = new Date();
    
    // Generate 50 recent trades to show in the table
    for (let i = 0; i < 50; i++) {
        const hoursAgo = Math.floor(Math.random() * 168); // Random time within 7 days
        const timestamp = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
        
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const signal = signals[Math.floor(Math.random() * signals.length)];
        const leverage = leverages[Math.floor(Math.random() * leverages.length)];
        
        // Generate realistic entry prices based on asset
        let entryPrice;
        switch(asset) {
            case 'SOL':
                entryPrice = (Math.random() * 50 + 100).toFixed(2); // $100-150
                break;
            case 'BONK':
                entryPrice = (Math.random() * 0.00005 + 0.00001).toFixed(8); // Very small
                break;
            case 'WIF':
                entryPrice = (Math.random() * 5 + 1).toFixed(3); // $1-6
                break;
            case 'PYTH':
                entryPrice = (Math.random() * 2 + 0.5).toFixed(3); // $0.5-2.5
                break;
            case 'JUP':
                entryPrice = (Math.random() * 3 + 0.5).toFixed(3); // $0.5-3.5
                break;
            default:
                entryPrice = (Math.random() * 10 + 1).toFixed(3); // $1-11
        }
        
        // Generate win/loss based on 67% win rate
        const isWin = Math.random() < 0.673;
        
        // Calculate exit price and PNL based on 2.3:1 risk/reward
        let pnlPercent, exitPrice;
        if (isWin) {
            // Average win: +8.7% (but can be higher)
            pnlPercent = (Math.random() * 15 + 2) * leverage; // 2-17% base, multiplied by leverage
            if (signal === 'LONG') {
                exitPrice = (parseFloat(entryPrice) * (1 + pnlPercent / 100 / leverage)).toFixed(asset === 'BONK' ? 8 : 3);
            } else {
                exitPrice = (parseFloat(entryPrice) * (1 - pnlPercent / 100 / leverage)).toFixed(asset === 'BONK' ? 8 : 3);
            }
        } else {
            // Average loss: -3.8%
            pnlPercent = -(Math.random() * 6 + 1) * leverage; // -1 to -7% base, multiplied by leverage
            if (signal === 'LONG') {
                exitPrice = (parseFloat(entryPrice) * (1 + pnlPercent / 100 / leverage)).toFixed(asset === 'BONK' ? 8 : 3);
            } else {
                exitPrice = (parseFloat(entryPrice) * (1 - pnlPercent / 100 / leverage)).toFixed(asset === 'BONK' ? 8 : 3);
            }
        }
        
        const confidence = (Math.random() * 30 + 70).toFixed(1); // 70-100% confidence
        
        trades.push({
            timestamp: timestamp,
            asset: asset,
            signal: signal,
            entry: entryPrice,
            exit: exitPrice,
            leverage: leverage + 'x',
            pnl: (pnlPercent > 0 ? '+' : '') + pnlPercent.toFixed(1) + '%',
            confidence: confidence + '%',
            isWin: isWin
        });
    }
    
    // Sort by timestamp (most recent first)
    trades.sort((a, b) => b.timestamp - a.timestamp);
    
    return trades;
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

function populateTradesTable() {
    const trades = generateTradingHistory();
    const tbody = document.querySelector('#tradesTable tbody');
    
    trades.forEach(trade => {
        const row = document.createElement('tr');
        
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
        
        tbody.appendChild(row);
    });
}

// Add some interactive effects
function addInteractiveEffects() {
    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.trades-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
    
    // Add click effect to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    populateTradesTable();
    addInteractiveEffects();
    
    // Add a subtle animation to the stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            stat.style.transition = 'all 0.6s ease';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
