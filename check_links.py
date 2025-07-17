#!/usr/bin/env python3
"""
Script to check all href links in EaseTrader HTML pages and identify missing/broken navigation.
"""

import os
import re
from glob import glob
from urllib.parse import urlparse
import json

def extract_hrefs_from_file(filepath):
    """Extract all href attributes from an HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all href attributes
        href_pattern = r'href\s*=\s*["\']([^"\']*)["\']'
        hrefs = re.findall(href_pattern, content, re.IGNORECASE)
        
        # Also check for onclick navigation
        onclick_pattern = r'onclick\s*=\s*["\']([^"\']*navigateTo[^"\']*)["\']'
        onclicks = re.findall(onclick_pattern, content, re.IGNORECASE)
        
        return hrefs, onclicks
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return [], []

def categorize_link(href):
    """Categorize a link as internal, external, anchor, or broken."""
    if not href or href.strip() == "":
        return "empty"
    elif href == "#":
        return "hash_only"
    elif href.startswith("#"):
        return "anchor"
    elif href.startswith("http://") or href.startswith("https://"):
        return "external"
    elif href.endswith(".html"):
        return "internal_html"
    elif href.startswith("mailto:"):
        return "email"
    elif href.startswith("tel:"):
        return "phone"
    else:
        return "other"

def check_file_exists(href, base_dir):
    """Check if an internal HTML file exists."""
    if href.endswith(".html"):
        full_path = os.path.join(base_dir, href)
        return os.path.exists(full_path)
    return True  # For non-HTML links, assume they're valid

def main():
    # Get all HTML files
    html_files = glob("easetrader_*.html") + glob("index.html")
    
    # Define expected pages based on mobile-nav.js
    expected_pages = {
        'auth': 'easetrader_auth.html',
        'landing': 'easetrader_landing.html', 
        'dashboard': 'easetrader_dashboard.html',
        'analytics': 'easetrader_analytics.html',
        'strategy_builder': 'easetrader_strategy_builder.html',
        'backtesting': 'easetrader_backtesting.html',
        'data_features': 'easetrader_data_features.html',
        'profile': 'easetrader_profile.html',
        'subscription': 'easetrader_subscription.html'
    }
    
    print("🔍 EaseTrader Link Analysis Report")
    print("=" * 50)
    
    all_issues = []
    link_summary = {}
    
    for html_file in sorted(html_files):
        print(f"\n📄 Analyzing: {html_file}")
        print("-" * 30)
        
        hrefs, onclicks = extract_hrefs_from_file(html_file)
        
        # Categorize links
        categories = {}
        issues = []
        
        for href in hrefs:
            category = categorize_link(href)
            if category not in categories:
                categories[category] = []
            categories[category].append(href)
            
            # Check for specific issues
            if category == "hash_only":
                issues.append(f"Non-functional link: href='#'")
            elif category == "internal_html" and not check_file_exists(href, "."):
                issues.append(f"Missing file: {href}")
            elif category == "empty":
                issues.append(f"Empty href attribute")
        
        # Report categories
        for category, links in categories.items():
            unique_links = list(set(links))
            print(f"  {category}: {len(unique_links)} unique ({len(links)} total)")
            if category in ["hash_only", "empty"] and unique_links:
                print(f"    Examples: {unique_links[:3]}")
        
        # Report onclick navigation
        if onclicks:
            print(f"  onclick_navigation: {len(onclicks)} found")
            unique_onclicks = list(set(onclicks))
            print(f"    Examples: {unique_onclicks[:3]}")
        
        # Report issues
        if issues:
            print(f"  ⚠️  ISSUES FOUND:")
            for issue in issues[:5]:  # Show first 5 issues
                print(f"    - {issue}")
            all_issues.extend([(html_file, issue) for issue in issues])
        else:
            print(f"  ✅ No major issues found")
        
        link_summary[html_file] = {
            'total_hrefs': len(hrefs),
            'categories': {k: len(v) for k, v in categories.items()},
            'onclicks': len(onclicks),
            'issues': len(issues)
        }
    
    # Summary report
    print(f"\n📊 SUMMARY REPORT")
    print("=" * 50)
    
    total_issues = len(all_issues)
    print(f"Total files analyzed: {len(html_files)}")
    print(f"Total issues found: {total_issues}")
    
    if total_issues > 0:
        print(f"\n🔧 ISSUES TO FIX:")
        print("-" * 20)
        issue_counts = {}
        for file, issue in all_issues:
            issue_type = issue.split(':')[0]
            if issue_type not in issue_counts:
                issue_counts[issue_type] = []
            issue_counts[issue_type].append((file, issue))
        
        for issue_type, issues in issue_counts.items():
            print(f"\n{issue_type} ({len(issues)} occurrences):")
            files_affected = list(set([f for f, _ in issues]))
            print(f"  Files affected: {', '.join(files_affected)}")
    
    # Check for missing navigation implementations
    print(f"\n🧭 NAVIGATION ANALYSIS:")
    print("-" * 25)
    
    files_with_hash_only = []
    files_with_onclick = []
    
    for file, summary in link_summary.items():
        if summary['categories'].get('hash_only', 0) > 0:
            files_with_hash_only.append(file)
        if summary['onclicks'] > 0:
            files_with_onclick.append(file)
    
    print(f"Files with '#' only links: {len(files_with_hash_only)}")
    if files_with_hash_only:
        print(f"  Files: {', '.join(files_with_hash_only)}")
    
    print(f"Files with onclick navigation: {len(files_with_onclick)}")
    if files_with_onclick:
        print(f"  Files: {', '.join(files_with_onclick)}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    print("-" * 20)
    
    if files_with_hash_only:
        print("1. Fix '#' only links by adding onclick='navigateTo(...)' handlers")
        print("2. Ensure all header navigation uses the mobile-nav.js system")
    
    if total_issues == 0:
        print("✅ All links appear to be properly configured!")
    
    # Check if all expected pages exist
    print(f"\n📁 FILE EXISTENCE CHECK:")
    print("-" * 25)
    
    missing_files = []
    for page_name, filename in expected_pages.items():
        if not os.path.exists(filename):
            missing_files.append(filename)
        else:
            print(f"✅ {filename}")
    
    if missing_files:
        print(f"\n❌ Missing files:")
        for file in missing_files:
            print(f"   - {file}")
    
    print(f"\n🎯 Script completed! Check the issues above to fix navigation problems.")

if __name__ == "__main__":
    main()