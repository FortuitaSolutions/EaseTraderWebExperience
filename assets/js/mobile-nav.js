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
        
        // Remove existing mobile navigation elements to avoid duplicates
        const existingMobileNav = document.querySelector('.mobile-nav');
        if (existingMobileNav) {
            existingMobileNav.remove();
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
                    <div style="font-size: 20px;">🏠</div>
                    <span style="font-size: 11px; margin-top: 4px;">Dashboard</span>
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
                    <div style="font-size: 20px;">📊</div>
                    <span style="font-size: 11px; margin-top: 4px;">Strategies</span>
                </button>
                <button onclick="navigateTo('backtesting')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'backtesting' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <div style="font-size: 20px;">⚡</div>
                    <span style="font-size: 11px; margin-top: 4px;">Backtests</span>
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
                    <div style="font-size: 20px;">📈</div>
                    <span style="font-size: 11px; margin-top: 4px;">Analytics</span>
                </button>
                <button onclick="navigateTo('data_features')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'data_features' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <div style="font-size: 20px;">📋</div>
                    <span style="font-size: 11px; margin-top: 4px;">Data</span>
                </button>
                <button onclick="navigateTo('profile')" style="
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px;
                    font-size: 12px;
                    color: ${currentPage === 'profile' ? '#4A90E2' : '#666'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                ">
                    <div style="font-size: 20px;">👤</div>
                    <span style="font-size: 11px; margin-top: 4px;">Profile</span>
                </button>
            </nav>
        `;
        
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', navHTML);
        
        // Add padding to body to prevent overlap
        document.body.style.paddingBottom = '80px';
        
        // Make functions global
        window.navigateTo = navigateTo;
        
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
})();