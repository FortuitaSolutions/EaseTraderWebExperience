# EaseTrader Mobile Web App

A mobile-optimized Progressive Web App (PWA) version of EaseTrader that works seamlessly on all mobile devices.

## Features

- 📱 Mobile-first responsive design
- ⚡ Progressive Web App (PWA) - installable on mobile devices
- 🔄 Single Page Application with smooth navigation
- 🔐 Mock authentication system
- 📊 All EaseTrader features in mobile format

## Quick Start

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial EaseTrader mobile app"
git branch -M main
git remote add origin https://github.com/FortuitaSolutions/EaseTraderWebExperience.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Save the settings

### 3. Access Your App

After a few minutes, your app will be available at:
```
https://FortuitaSolutions.github.io/EaseTraderWebExperience/
```

## Mobile Installation

### iOS (Safari)
1. Open the URL in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Give it a name and tap "Add"

### Android (Chrome)
1. Open the URL in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Confirm the installation

## Navigation Flow

1. **Landing Page** → Introduction to EaseTrader
2. **Auth Page** → Login (any email/password works for demo)
3. **Dashboard** → Main app dashboard
4. **Analytics** → Trading analytics
5. **Strategy Builder** → Build trading strategies
6. **Profile** → User profile and settings

## Development

### Local Testing

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then open http://localhost:8000
```

### File Structure

```
.
├── index.html              # Main app shell
├── manifest.json           # PWA configuration
├── assets/
│   ├── css/
│   │   └── app.css        # Mobile styles
│   ├── js/
│   │   └── app.js         # Router and app logic
│   └── icons/             # App icons
├── pages/                  # Individual pages (if needed)
└── easetrader_*.html      # Your existing pages
```

## Features

- **Responsive Design**: Optimized for all mobile screen sizes
- **Touch-Friendly**: Large touch targets and swipe gestures
- **Offline Support**: Basic caching for offline access (can be enhanced)
- **Fast Navigation**: Client-side routing for instant page transitions
- **PWA Ready**: Installable as a native-like app

## Troubleshooting

### Pages not loading
- Check browser console for errors
- Verify all HTML files are in the root directory
- Ensure file names match the mapping in `app.js`

### GitHub Pages 404
- Wait 5-10 minutes after first deployment
- Check GitHub Actions tab for deployment status
- Verify GitHub Pages is enabled with "GitHub Actions" source

### Mobile installation not working
- Ensure you're using HTTPS (GitHub Pages provides this)
- Check that manifest.json is properly linked
- For iOS, must use Safari browser

## Next Steps

- Add real authentication system
- Implement data persistence
- Add push notifications
- Enhance offline capabilities
- Add more interactive features

## Support

For issues or questions, please open an issue in the GitHub repository.