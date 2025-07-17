#!/usr/bin/env python3
"""
Script to automatically fix all header navigation links in EaseTrader HTML pages.
Replaces href="#" with proper onclick navigation handlers.
"""

import os
import re
from glob import glob

def fix_navigation_in_file(filepath):
    """Fix navigation links in a single HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Define the navigation mappings
        nav_mappings = {
            # Header navigation links
            r'<a href="#" class="logo">EaseTrader</a>': '<a href="#" onclick="navigateTo(\'landing\')" class="logo">EaseTrader</a>',
            
            # Standard header navigation patterns
            r'<a href="#">Dashboard</a>': '<a href="#" onclick="navigateTo(\'dashboard\')">Dashboard</a>',
            r'<a href="#">Strategies</a>': '<a href="#" onclick="navigateTo(\'strategy_builder\')">Strategies</a>',
            r'<a href="#">Backtests</a>': '<a href="#" onclick="navigateTo(\'backtesting\')">Backtests</a>',
            r'<a href="#">Analytics</a>': '<a href="#" onclick="navigateTo(\'analytics\')">Analytics</a>',
            r'<a href="#">Data</a>': '<a href="#" onclick="navigateTo(\'data_features\')">Data</a>',
            r'<a href="#" class="active">Data</a>': '<a href="#" onclick="navigateTo(\'data_features\')" class="active">Data</a>',
            
            # Header action buttons
            r'<a href="#" class="btn btn-secondary">Log In</a>': '<a href="#" onclick="navigateTo(\'auth\')" class="btn btn-secondary">Log In</a>',
            r'<a href="#" class="btn btn-primary">Get Started</a>': '<a href="#" onclick="navigateTo(\'auth\')" class="btn btn-primary">Get Started</a>',
            
            # Landing page hero buttons
            r'<a href="#" class="btn btn-primary btn-hero">Start Trading Now</a>': '<a href="#" onclick="navigateTo(\'auth\')" class="btn btn-primary btn-hero">Start Trading Now</a>',
            r'<a href="#" class="btn btn-secondary btn-hero">Watch Demo</a>': '<a href="#" onclick="navigateTo(\'dashboard\')" class="btn btn-secondary btn-hero">Watch Demo</a>',
            
            # CTA section buttons
            r'<a href="#" class="btn btn-cta">Start Free Trial</a>': '<a href="#" onclick="navigateTo(\'auth\')" class="btn btn-cta">Start Free Trial</a>',
            r'<a href="#" class="btn btn-cta-secondary">View Pricing</a>': '<a href="#" onclick="navigateTo(\'subscription\')" class="btn btn-cta-secondary">View Pricing</a>',
            
            # Feature links
            r'<a href="#" class="feature-link">Learn More →</a>': '<a href="#" onclick="navigateTo(\'strategy_builder\')" class="feature-link">Learn More →</a>',
            r'<a href="#" class="feature-link">Try Backtesting →</a>': '<a href="#" onclick="navigateTo(\'backtesting\')" class="feature-link">Try Backtesting →</a>',
            r'<a href="#" class="feature-link">Explore Data →</a>': '<a href="#" onclick="navigateTo(\'data_features\')" class="feature-link">Explore Data →</a>',
            r'<a href="#" class="feature-link">Get Mobile App →</a>': '<a href="#" onclick="navigateTo(\'landing\')" class="feature-link">Get Mobile App →</a>',
            r'<a href="#" class="feature-link">View Analytics →</a>': '<a href="#" onclick="navigateTo(\'analytics\')" class="feature-link">View Analytics →</a>',
            r'<a href="#" class="feature-link">Security Details →</a>': '<a href="#" onclick="navigateTo(\'profile\')" class="feature-link">Security Details →</a>',
            
            # Footer links (common ones)
            r'<a href="#">Strategy Builder</a>': '<a href="#" onclick="navigateTo(\'strategy_builder\')">Strategy Builder</a>',
            r'<a href="#">Backtesting</a>': '<a href="#" onclick="navigateTo(\'backtesting\')">Backtesting</a>',
        }
        
        changes_made = 0
        
        # Apply all mappings
        for pattern, replacement in nav_mappings.items():
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes_made += 1
        
        # Save the file if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes_made
        else:
            return 0
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return 0

def main():
    # Get all HTML files except index.html and profile.html (already fixed)
    html_files = [f for f in glob("easetrader_*.html") if f != "easetrader_profile.html"]
    
    print("🔧 Fixing Navigation Links in EaseTrader Pages")
    print("=" * 50)
    
    total_files_processed = 0
    total_changes = 0
    
    for html_file in sorted(html_files):
        print(f"Processing: {html_file}")
        
        changes = fix_navigation_in_file(html_file)
        if changes > 0:
            print(f"  ✅ Fixed {changes} navigation patterns")
            total_changes += changes
            total_files_processed += 1
        else:
            print(f"  ℹ️  No changes needed")
    
    print(f"\n📊 SUMMARY:")
    print(f"Files processed: {len(html_files)}")
    print(f"Files modified: {total_files_processed}")
    print(f"Total navigation patterns fixed: {total_changes}")
    
    if total_changes > 0:
        print(f"\n✅ Navigation fix completed!")
        print(f"All header links should now use the navigateTo() function.")
        print(f"Remember to commit these changes.")
    else:
        print(f"\n✅ All files were already properly configured.")

if __name__ == "__main__":
    main()