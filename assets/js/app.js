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

// Load page function
async function loadPage(pageName, updateHistory = true) {
    try {
        // Check authentication for protected pages
        const protectedPages = ['dashboard', 'analytics', 'strategy_builder', 'backtesting', 'data_features', 'profile', 'subscription'];
        if (protectedPages.includes(pageName) && !isAuthenticated) {
            loadPage('auth');
            return;
        }
        
        // Get the HTML file name
        const fileName = pageMap[pageName] || pageMap['landing'];
        
        // Show loading state
        document.getElementById('app').innerHTML = '<div class="loading-screen"><div class="spinner"></div><p>Loading...</p></div>';
        
        // Fetch the page content
        const response = await fetch(fileName);
        let html = await response.text();
        
        // Extract body content (remove full HTML structure for mobile view)
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            html = bodyMatch[1];
        }
        
        // Inject mobile-specific modifications
        html = adaptPageForMobile(html, pageName);
        
        // Update the app container
        document.getElementById('app').innerHTML = html;
        
        // Show/hide navigation based on page
        const bottomNav = document.getElementById('bottom-nav');
        if (pageName === 'auth' || pageName === 'landing') {
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
        
        // Execute page-specific scripts
        executePageScripts(pageName);
        
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('app').innerHTML = `
            <div class="page">
                <div class="page-header">
                    <h1>Error</h1>
                </div>
                <div class="card">
                    <p>Failed to load page: ${pageName}</p>
                    <button class="btn" onclick="loadPage('landing')">Go to Home</button>
                </div>
            </div>
        `;
    }
}

// Adapt pages for mobile view
function adaptPageForMobile(html, pageName) {
    // Wrap content in mobile container
    let mobileHtml = '<div class="page active">';
    
    // Add page header if not auth/landing
    if (pageName !== 'auth' && pageName !== 'landing') {
        const titles = {
            'dashboard': 'Dashboard',
            'analytics': 'Analytics',
            'strategy_builder': 'Strategy Builder',
            'backtesting': 'Backtesting',
            'data_features': 'Data Features',
            'profile': 'Profile',
            'subscription': 'Subscription'
        };
        mobileHtml += `<div class="page-header"><h1>${titles[pageName] || pageName}</h1></div>`;
    }
    
    // Process the HTML content
    mobileHtml += html;
    mobileHtml += '</div>';
    
    // Replace desktop navigation with mobile-friendly links
    mobileHtml = mobileHtml.replace(/<a\s+href="([^"]+\.html)"/g, (match, href) => {
        const page = Object.keys(pageMap).find(key => pageMap[key] === href);
        if (page) {
            return `<a href="#" onclick="loadPage('${page}'); return false;"`;
        }
        return match;
    });
    
    // Make forms mobile-friendly
    mobileHtml = mobileHtml.replace(/<form[^>]*>/g, '<form onsubmit="handleFormSubmit(event)">');
    
    return mobileHtml;
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

// Execute page-specific scripts
function executePageScripts(pageName) {
    // Re-initialize any charts, animations, or interactive elements
    if (pageName === 'analytics' || pageName === 'dashboard') {
        // Initialize any charts if they exist
        if (typeof Chart !== 'undefined') {
            initializeCharts();
        }
    }
    
    // Handle logout buttons
    const logoutBtns = document.querySelectorAll('[onclick*="logout"]');
    logoutBtns.forEach(btn => {
        btn.onclick = () => {
            isAuthenticated = false;
            localStorage.removeItem('easetrader_auth');
            loadPage('auth');
        };
    });
    
    // Handle any "Get Started" or "Sign In" buttons on landing page
    if (pageName === 'landing') {
        // Find links with "auth" in href
        const authLinks = document.querySelectorAll('a[href*="auth"]');
        authLinks.forEach(btn => {
            btn.href = '#auth';
            btn.onclick = (e) => {
                e.preventDefault();
                loadPage('auth');
            };
        });
        
        // Find buttons with "Started" or "Sign" in text content
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('started') || text.includes('sign')) {
                btn.onclick = () => loadPage('auth');
            }
        });
        
        // Handle navigation to features
        const featureLinks = document.querySelectorAll('a[href*="dashboard"], a[href*="analytics"], a[href*="strategy"]');
        featureLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                if (!isAuthenticated) {
                    loadPage('auth');
                } else {
                    const page = link.href.match(/easetrader_(\w+)\.html/);
                    if (page && page[1]) {
                        loadPage(page[1]);
                    }
                }
            };
        });
    }
    
    // Handle any form that looks like login on auth page
    if (pageName === 'auth') {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.onsubmit) {
                form.onsubmit = handleFormSubmit;
            }
        });
    }
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