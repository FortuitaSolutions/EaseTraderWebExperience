// Mobile App Router
let currentPage = null;
let isAuthenticated = false;

// Page mapping to your existing HTML files
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is returning (mock authentication)
    isAuthenticated = localStorage.getItem('easetrader_auth') === 'true';
    
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        const page = event.state?.page || 'landing';
        loadPage(page, false);
    });
    
    // Load initial page
    const hash = window.location.hash.slice(1);
    let initialPage;
    
    // If user is on landing page specifically, always show it
    if (hash === 'landing') {
        initialPage = 'landing';
    } else if (isAuthenticated) {
        initialPage = hash || 'dashboard';
    } else {
        initialPage = hash === 'auth' ? 'auth' : 'landing';
    }
    
    loadPage(initialPage);
});

// Load page function - simplified approach
async function loadPage(pageName, updateHistory = true) {
    try {
        // Get the HTML file name
        const fileName = pageMap[pageName] || pageMap['landing'];
        
        // Show loading state
        document.getElementById('app').innerHTML = '<div class="loading-screen"><div class="spinner"></div><p>Loading...</p></div>';
        
        // Fetch the page content
        const response = await fetch(fileName);
        const html = await response.text();
        
        // Create iframe to load the page cleanly
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.paddingBottom = '80px'; // Space for mobile nav
        
        // Update the app container
        document.getElementById('app').innerHTML = '';
        document.getElementById('app').appendChild(iframe);
        
        // Load content into iframe
        iframe.contentDocument.open();
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
        
        // Show mobile navigation for all pages except landing
        const bottomNav = document.getElementById('bottom-nav');
        if (pageName === 'landing') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
            updateActiveNavButton(pageName);
        }
        
        // Update browser history
        if (updateHistory) {
            history.pushState({page: pageName}, '', `#${pageName}`);
        }
        
        currentPage = pageName;
        
        // Add mobile navigation to iframe content
        addMobileNavToIframe(iframe, pageName);
        
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('app').innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>Error Loading Page</h2>
                <p>Failed to load page: ${pageName}</p>
                <button onclick="loadPage('landing')" style="padding: 10px 20px; background: #4A90E2; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to Home</button>
            </div>
        `;
    }
}

// Add mobile navigation support to iframe content
function addMobileNavToIframe(iframe, pageName) {
    iframe.onload = function() {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Add mobile viewport meta tag if not present
            if (!doc.querySelector('meta[name="viewport"]')) {
                const meta = doc.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                doc.head.appendChild(meta);
            }
            
            // Replace internal links with mobile navigation
            const links = doc.querySelectorAll('a[href*=".html"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                const page = Object.keys(pageMap).find(key => pageMap[key] === href);
                if (page) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.parent.loadPage(page);
                    });
                }
            });
            
            // Handle forms for auth page
            if (pageName === 'auth') {
                const forms = doc.querySelectorAll('form');
                forms.forEach(form => {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        // Mock authentication - just redirect to dashboard
                        window.parent.isAuthenticated = true;
                        window.parent.localStorage.setItem('easetrader_auth', 'true');
                        window.parent.loadPage('dashboard');
                    });
                });
            }
            
        } catch (error) {
            console.warn('Could not modify iframe content:', error);
        }
    };
}

// Update active navigation button
function updateActiveNavButton(pageName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('active');
        }
    });
}

// Handle form submissions
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Handle login form
    if (event.target.querySelector('input[type="email"]') && currentPage === 'auth') {
        // Mock authentication
        isAuthenticated = true;
        localStorage.setItem('easetrader_auth', 'true');
        
        // Show success message
        const form = event.target;
        form.innerHTML = '<div class="card"><p>Login successful! Redirecting...</p></div>';
        
        // Redirect to dashboard
        setTimeout(() => {
            loadPage('dashboard');
        }, 1000);
    }
    
    return false;
}

// Execute page-specific scripts (simplified for iframe approach)
function executePageScripts(pageName) {
    // Page-specific logic is now handled in addMobileNavToIframe
    // This function can be used for any main window logic
    
    console.log(`Page loaded: ${pageName}`);
}

// Initialize charts if Chart.js is available
function initializeCharts() {
    // This would initialize any Chart.js charts in your pages
    const chartElements = document.querySelectorAll('canvas');
    chartElements.forEach(canvas => {
        // Initialize charts based on data attributes or IDs
    });
}

// Menu functions
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const isActive = menu.style.display === 'block';
    
    if (isActive) {
        menu.style.display = 'none';
        menu.classList.remove('active');
    } else {
        menu.style.display = 'block';
        setTimeout(() => menu.classList.add('active'), 10);
    }
}

function navigateFromMenu(page) {
    toggleMenu();
    loadPage(page);
}

function logout() {
    isAuthenticated = false;
    localStorage.removeItem('easetrader_auth');
    toggleMenu();
    loadPage('auth');
}

// Global navigation function
window.loadPage = loadPage;
window.toggleMenu = toggleMenu;
window.navigateFromMenu = navigateFromMenu;
window.logout = logout;