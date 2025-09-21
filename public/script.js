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
