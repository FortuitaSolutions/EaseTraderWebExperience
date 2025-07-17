// Mobile Navigation for EaseTrader Pages
(function() {
    // Page mapping
    const pageMap = {
        'auth': 'easetrader_auth.html',
        'landing': 'easetrader_landing.html',
        'dashboard': 'easetrader_dashboard.html',
        'analytics': 'easetrader_analytics.html',
        'strategy_builder': 'easetrader_strategy_builder.html',
        'backtesting': 'easetrader_backtesting.html',
        'data_features': 'easetrader_data_features.html',
        'profile': 'easetrader_profile.html',
        'subscription': 'easetrader_subscription.html'
    };
    
    // Get current page name
    const currentFile = window.location.pathname.split('/').pop();
    const currentPage = Object.keys(pageMap).find(key => pageMap[key] === currentFile) || 'landing';
    
    // Only add mobile nav if we're on an actual page (not index)
    if (currentFile && currentFile !== 'index.html' && currentFile !== '') {
        addMobileNavigation(currentPage);
    }
    
    // Add navigation function
    function navigateTo(pageName) {
        const fileName = pageMap[pageName];
        if (fileName) {
            window.location.href = fileName;
        }
    }
    
    // Add mobile navigation
    function addMobileNavigation(currentPage) {
        // Don't add nav to landing page
        if (currentPage === 'landing') {
            return;
        }
        
        // Create mobile navigation HTML
        const navHTML = `
            <nav id="mobile-bottom-nav" style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e1e4e8;
                display: flex;
                height: 60px;
                z-index: 9999;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            ">
                <button onclick="navigateTo('dashboard')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'dashboard' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                    <span style="font-size: 11px; margin-top: 4px;">Dashboard</span>
                </button>
                <button onclick="navigateTo('analytics')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'analytics' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <span style="font-size: 11px; margin-top: 4px;">Analytics</span>
                </button>
                <button onclick="navigateTo('strategy_builder')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'strategy_builder' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                    </svg>
                    <span style="font-size: 11px; margin-top: 4px;">Strategy</span>
                </button>
                <button onclick="showMobileMenu()" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                    <span style="font-size: 11px; margin-top: 4px;">Menu</span>
                </button>
            </nav>
        `;
        
        // Add mobile menu overlay
        const menuHTML = `
            <div id="mobile-menu-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: none;
            " onclick="hideMobileMenu()">
                <div style="
                    position: absolute;
                    bottom: 60px;
                    left: 0;
                    right: 0;
                    background: white;
                    border-radius: 20px 20px 0 0;
                    padding: 20px;
                    max-height: 70vh;
                    overflow-y: auto;
                " onclick="event.stopPropagation()">
                    <h3 style="margin-bottom: 20px; text-align: center;">More Pages</h3>
                    <div style="display: grid; gap: 10px;">
                        <button onclick="navigateTo('profile')" style="padding: 15px; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; text-align: left;">
                            👤 Profile
                        </button>
                        <button onclick="navigateTo('backtesting')" style="padding: 15px; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; text-align: left;">
                            📊 Backtesting
                        </button>
                        <button onclick="navigateTo('data_features')" style="padding: 15px; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; text-align: left;">
                            📈 Data Features
                        </button>
                        <button onclick="navigateTo('subscription')" style="padding: 15px; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; text-align: left;">
                            💳 Subscription
                        </button>
                        <button onclick="navigateTo('landing')" style="padding: 15px; border: none; background: #f8f9fa; border-radius: 8px; cursor: pointer; text-align: left;">
                            🏠 Home
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', navHTML);
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        
        // Add padding to body to prevent overlap
        document.body.style.paddingBottom = '80px';
        
        // Make functions global
        window.navigateTo = navigateTo;
        window.showMobileMenu = showMobileMenu;
        window.hideMobileMenu = hideMobileMenu;
        
        // Fix internal links
        fixInternalLinks();
    }
    
    // Fix internal links on the page
    function fixInternalLinks() {
        const links = document.querySelectorAll('a[href*=".html"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const page = Object.keys(pageMap).find(key => pageMap[key] === href);
            if (page) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateTo(page);
                });
            }
        });
        
        // Handle forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                navigateTo('dashboard');
            });
        });
        
        // Handle "Get Started" buttons
        const buttons = document.querySelectorAll('button, a');
        buttons.forEach(button => {
            const text = button.textContent.toLowerCase();
            if (text.includes('get started') || text.includes('sign in') || text.includes('login')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateTo('auth');
                });
            }
        });
    }
    
    // Mobile menu functions
    function showMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
    
    function hideMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
})();