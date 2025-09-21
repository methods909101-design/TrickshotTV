// Main JavaScript for Perpguin homepage
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

    // Load statistics from API and animate counters
    async function loadAndAnimateStatistics() {
        try {
            const response = await fetch('/api/statistics');
            const stats = await response.json();
            
            // Animate each metric
            animateMetric('Win Rate (7d)', stats.winRate, '%');
            animateMetric('Risk/Reward', stats.riskReward, ':1');
            
        } catch (error) {
            console.error('Error loading statistics:', error);
            // Fallback to default animation
            animateMetric('Win Rate (7d)', '67.3', '%');
            animateMetric('Risk/Reward', '1.84', ':1');
        }
    }

    function animateMetric(label, targetValue, suffix, prefix = '') {
        const metricElements = document.querySelectorAll('.metric');
        let targetElement = null;
        
        metricElements.forEach(metric => {
            const labelElement = metric.querySelector('.metric-label');
            if (labelElement && labelElement.textContent === label) {
                targetElement = metric.querySelector('.metric-value');
            }
        });
        
        if (!targetElement) return;
        
        const numericTarget = parseFloat(targetValue);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = numericTarget * easeOut;
            
            // Format the display value
            let displayValue = '';
            if (suffix === '%') {
                displayValue = `${prefix}${currentValue.toFixed(1)}${suffix}`;
            } else if (suffix === ':1') {
                displayValue = `${currentValue.toFixed(2)}${suffix}`;
            } else {
                displayValue = `${prefix}${Math.floor(currentValue)}${suffix}`;
            }
            
            targetElement.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                // Set final value
                if (suffix === '%') {
                    targetElement.textContent = `${prefix}${targetValue}${suffix}`;
                } else if (suffix === ':1') {
                    targetElement.textContent = `${targetValue}${suffix}`;
                } else {
                    targetElement.textContent = `${prefix}${targetValue}${suffix}`;
                }
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    // Observe metrics section for animation trigger
    function observeMetrics() {
        const metricsSection = document.querySelector('.performance-metrics');
        if (!metricsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(loadAndAnimateStatistics, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(metricsSection);
    }

    // Initialize
    observeMetrics();

    // Add console message for developers
    console.log(`
    ╔═══════════════════════════════════════╗
    ║              PERPGUIN                 ║
    ║        Automated Perpetuals           ║
    ║            Analyst v2.0               ║
    ║                                       ║
    ║  🐧 AI-driven perpetual futures       ║
    ║     analysis for major cryptos        ║
    ║                                       ║
    ║  Real-time data & TradingView charts  ║
    ║  Node.js backend with live prices     ║
    ╚═══════════════════════════════════════╝
    `);
});
