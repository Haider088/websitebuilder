# Analytics & Optimization Guide

Complete guide to the Analytics & Optimization system in the Restaurant Website Builder.

## Overview

The Analytics & Optimization system provides comprehensive insights into your website's SEO, accessibility, performance, and usage patterns. It automatically analyzes your entire project and provides actionable recommendations for improvement.

## Key Features

### 1. Comprehensive Analytics Dashboard
**All-in-one insights** for your website
- **Location**: Toolbar > "Analytics" button
- **Real-time analysis**: Analyzes current project state
- **Export reports**: Download analytics as JSON

**Six Main Views:**
1. **Overview** - Scores, metrics, top issues
2. **Issues** - All problems sorted by severity
3. **SEO** - Search engine optimization analysis
4. **Accessibility** - A11y compliance checking
5. **Performance** - Load time and optimization
6. **Usage** - Component and page statistics

### 2. SEO Analysis (Search Engine Optimization)
**Improve search rankings** and visibility
- Meta title analysis (length, presence)
- Meta description evaluation
- Heading structure checking
- Contact information completeness
- Site name and branding review

**What's Checked:**
- ✓ Meta titles (50-60 character optimal)
- ✓ Meta descriptions (150-160 character optimal)
- ✓ Heading presence (H1 tags)
- ✓ Site name configuration
- ✓ Contact information for local SEO
- ✓ Page-by-page SEO status

**Scoring:**
- **90-100**: Excellent SEO setup
- **70-89**: Good, minor improvements needed
- **50-69**: Needs work, several issues
- **0-49**: Poor, critical issues

### 3. Accessibility Analysis
**Ensure website is usable by everyone**
- Image alt text checking
- Color contrast analysis
- Form label verification
- Navigation accessibility
- Screen reader compatibility

**What's Checked:**
- ✓ Alt text on all images
- ✓ Color contrast ratios (4.5:1 minimum)
- ✓ Form labels and associations
- ✓ Keyboard navigation support
- ✓ Skip navigation links
- ✓ ARIA best practices

**Why It Matters:**
- Legal compliance (ADA, WCAG)
- Broader audience reach
- Better user experience
- Improved SEO (Google rewards accessibility)

### 4. Performance Analysis
**Optimize loading speed and user experience**
- Total project size calculation
- Image optimization checking
- Component complexity analysis
- Estimated load time
- Asset count monitoring

**What's Checked:**
- ✓ Image file sizes (< 500KB recommended)
- ✓ Total asset count
- ✓ Page component density
- ✓ Gallery image counts
- ✓ Overall project weight
- ✓ Estimated load time

**Performance Impact:**
- **Fast load** (< 2s): Better user retention
- **Medium load** (2-3s): Acceptable for most users
- **Slow load** (> 3s): High bounce rate risk

### 5. Component Usage Statistics
**Understand which components are most used**
- Usage count per component type
- Pages where each component appears
- Visual usage distribution
- Most/least popular components

**Use Cases:**
- Identify redundant components
- Find underutilized features
- Optimize component library
- Plan future templates

### 6. Page Statistics
**Individual page analysis**
- Component count per page
- Form count tracking
- Image count per page
- SEO metadata presence
- Estimated page size

**Helps With:**
- Balancing content across pages
- Identifying heavy pages
- Ensuring consistent SEO
- Planning page improvements

### 7. Issue Tracking & Prioritization
**Smart issue detection and categorization**
- **Critical**: Must fix (SEO, accessibility blockers)
- **Warning**: Should fix (performance, best practices)
- **Info**: Nice to have (optimization suggestions)

**Issue Types:**
- SEO issues
- Accessibility problems
- Performance bottlenecks
- Best practice violations

## User Interface

### Analytics Dialog

**Header:**
- Title: "Analytics & Optimization"
- Description: Brief explanation
- Export Report button

**Tabs:**
- **Overview** - Summary of all scores
- **Issues** - All detected problems
- **SEO** - Search optimization details
- **Accessibility** - A11y compliance
- **Performance** - Speed & optimization
- **Usage** - Component & page stats

### Overview Tab

**Score Cards:**
- SEO Score (0-100) with color-coded indicator
- Accessibility Score with progress bar
- Performance Score with rating
- Visual color coding (green/yellow/red)

**Project Overview:**
- Total pages count
- Total components count
- Total assets count
- Project size in KB

**Top Issues:**
- Shows first 5 critical/warning issues
- Quick preview of problems
- Links to full issue list

### Issues Tab

**All Issues List:**
- Sorted by severity (Critical → Warning → Info)
- Icon indicators for each level
- Issue title and description
- Specific recommendation
- Type and level badges
- Page/component association

**Empty State:**
- "No Issues Found!" message
- Checkmark icon
- Encouragement message

### SEO Tab

**Score Display:**
- Large SEO score (0-100)
- Progress bar visualization
- Score label (Excellent/Good/Needs Work/Poor)

**Recommendations List:**
- Actionable bullet points
- Based on detected issues
- Prioritized by impact

**Page-by-Page Analysis:**
- Each page listed
- Meta title status (present/missing)
- Meta description status
- Component count
- Visual badges for completeness

### Accessibility Tab

**Score Display:**
- Accessibility score with rating
- Progress bar
- Score interpretation

**Recommendations:**
- Specific a11y improvements
- Best practices guidance
- WCAG compliance tips

**Issues List:**
- Detailed accessibility problems
- Specific components affected
- Fix instructions

### Performance Tab

**Performance Metrics:**
- Performance score (0-100)
- Estimated load time in seconds
- Total project size
- Image size breakdown

**Optimization Tips:**
- Image compression suggestions
- Lazy loading recommendations
- Code splitting ideas
- Asset optimization

**Issues:**
- Large file warnings
- Complexity alerts
- Load time concerns

### Usage Tab

**Component Usage:**
- Bar chart visualization
- Usage count per component
- Pages where used
- Percentage of total

**Page Statistics:**
- Component count per page
- Form count
- Image count
- Estimated page size

## Technical Details

### Analysis Engine

**Location**: `/utils/analytics.ts`

**Core Functions:**

```typescript
analyzeSEO(pages, globalSettings): SEOScore
analyzeAccessibility(pages): AccessibilityScore
analyzePerformance(pages, assets): PerformanceScore
analyzeComponentUsage(pages): ComponentUsageStats[]
analyzePageStats(pages): PageStats[]
generateAnalytics(pages, globalSettings, assets): ProjectAnalytics
```

**Analysis Triggers:**
- Manual: Click "Analytics" button
- On-demand: Opening analytics dialog
- Real-time: Analyzes current state

### Scoring Algorithm

**SEO Score (100 points max):**
- Missing meta title: -15 points (critical)
- Invalid title length: -5 points (warning)
- Missing meta description: -15 points (critical)
- Invalid description length: -5 points (warning)
- No heading structure: -5 points
- Generic site name: -5 points
- Missing contact info: -3 points

**Accessibility Score (100 points max):**
- Missing image alt text: -10 points per image
- Low contrast: -8 points per instance
- Missing form labels: -10 points per form
- No skip navigation: -2 points

**Performance Score (100 points max):**
- Large assets (> 500KB): -8 points each
- Too many assets (> 30): -5 points
- Complex pages (> 20 components): -3 points per page
- Large galleries (> 12 images): -5 points per gallery
- Slow load time (> 3s): -10 points

### Issue Levels

**Critical** (Must Fix):
- Missing SEO meta tags
- Missing alt text on images
- Missing form labels
- Color contrast failures
- Severity: Blocks users or search engines

**Warning** (Should Fix):
- Suboptimal meta tag lengths
- Large file sizes
- Performance bottlenecks
- Severity: Degrades experience

**Info** (Nice to Have):
- Skip navigation suggestions
- Minor optimizations
- Best practice tips
- Severity: Polish and perfection

### Data Structure

**ProjectAnalytics:**
```typescript
{
  overview: {
    totalPages: number;
    totalComponents: number;
    totalForms: number;
    totalAssets: number;
    projectSize: number;
    lastAnalyzed: timestamp;
  };
  componentUsage: ComponentUsageStats[];
  pageStats: PageStats[];
  seo: SEOScore;
  accessibility: AccessibilityScore;
  performance: PerformanceScore;
  issues: AnalyticsIssue[];
}
```

## Usage Scenarios

### Scenario 1: Pre-Launch SEO Check

**User Story:**
"I'm about to launch my restaurant website and want to ensure good SEO."

**Steps:**
1. Click "Analytics" in toolbar
2. Go to "SEO" tab
3. Review SEO score (should be 90+)
4. Check page-by-page analysis
5. Fix any missing meta titles/descriptions
6. Ensure site name is set
7. Add contact information
8. Re-analyze to verify 100% compliance

### Scenario 2: Accessibility Audit

**User Story:**
"I need to ensure my website is accessible to all users including those with disabilities."

**Steps:**
1. Open Analytics dashboard
2. Go to "Accessibility" tab
3. Review accessibility score
4. Check all images have alt text
5. Verify form labels are present
6. Test color contrast
7. Fix critical issues first
8. Aim for 90+ accessibility score

### Scenario 3: Performance Optimization

**User Story:**
"My website feels slow. How can I make it faster?"

**Steps:**
1. Open Analytics > "Performance" tab
2. Check estimated load time
3. Review total project size
4. Identify large assets (> 500KB)
5. Compress/optimize images
6. Remove unnecessary components
7. Reduce gallery image counts
8. Re-check performance score

### Scenario 4: Content Planning

**User Story:**
"I want to understand which components I use most and plan future pages."

**Steps:**
1. Open Analytics > "Usage" tab
2. Review component usage stats
3. See which components are popular
4. Check page statistics
5. Identify underutilized components
6. Plan new pages based on successful patterns
7. Balance content across pages

### Scenario 5: Regular Health Checks

**User Story:**
"I want to regularly monitor my website's health."

**Steps:**
1. Weekly: Open Analytics > "Overview"
2. Check all three scores (SEO, A11y, Perf)
3. Review top issues
4. Fix critical issues immediately
5. Plan fixes for warnings
6. Export report for records
7. Track improvement over time

## Best Practices

### 1. SEO Optimization
**Best Practices:**
- Write unique meta titles (50-60 chars)
- Create compelling descriptions (150-160 chars)
- Use descriptive site name
- Include complete contact info
- Add keywords naturally
- Ensure H1 tags on all pages

**Good Meta Title:**
```
"Luigi's Italian Restaurant | Authentic Pizza & Pasta in Boston"
```

**Good Meta Description:**
```
"Experience authentic Italian cuisine at Luigi's. Fresh pasta, wood-fired pizzas, and family recipes since 1985. Book your table in Boston's North End today!"
```

### 2. Accessibility
**Best Practices:**
- Add alt text to ALL images
- Describe what's in the image
- Keep alt text concise (< 125 chars)
- Ensure 4.5:1 contrast ratio
- Label all form inputs
- Use semantic HTML

**Good Alt Text Examples:**
- ✓ "Grilled salmon with lemon and herbs on white plate"
- ✓ "Chef Maria tossing pizza dough in kitchen"
- ✗ "Image1.jpg" (not descriptive)
- ✗ "Photo" (too vague)

### 3. Performance
**Best Practices:**
- Keep images under 500KB each
- Use WebP format when possible
- Limit galleries to 12 images
- Keep pages under 20 components
- Compress all assets
- Aim for < 2MB total page weight

**Image Optimization:**
- Before: 2.5MB JPEG
- After: 350KB WebP (optimized)
- Savings: 86% smaller, same quality

### 4. Regular Monitoring
**Recommended Schedule:**
- **Daily**: Quick score check during active development
- **Weekly**: Full analytics review
- **Monthly**: Export report for records
- **Pre-launch**: Complete audit with all scores 90+
- **Post-launch**: Monthly maintenance checks

### 5. Issue Prioritization
**Fix In This Order:**
1. **Critical SEO** - Blocks search engines
2. **Critical A11y** - Blocks users
3. **Warning Performance** - Affects all users
4. **Warning SEO** - Partial impact
5. **Info items** - Nice to have

## Reports & Exports

### Export Functionality

**What's Exported:**
- Generated timestamp
- Overview statistics
- All three scores (SEO, A11y, Perf)
- Complete issues list
- All recommendations
- JSON format for programmatic use

**Export Location:**
Downloads as: `analytics-report-{timestamp}.json`

**Use Cases:**
- Share with team members
- Track improvements over time
- Client reporting
- Documentation
- Before/after comparisons

**Example Export:**
```json
{
  "generatedAt": "2025-10-17T...",
  "overview": {
    "totalPages": 5,
    "totalComponents": 47,
    "totalAssets": 23,
    "projectSize": 145.3
  },
  "scores": {
    "seo": 85,
    "accessibility": 92,
    "performance": 78
  },
  "issues": [
    {
      "type": "seo",
      "level": "warning",
      "title": "Meta title length issue",
      "recommendation": "Shorten to 50-60 characters"
    }
  ]
}
```

## Integration with Other Features

### Version Control
- Run analytics before saving versions
- Compare analytics across versions
- Track score improvements
- Document optimizations

### Form Builder
- Checks form accessibility
- Validates label presence
- Ensures proper markup
- Reviews form usability

### Asset Manager
- Analyzes asset sizes
- Tracks usage across pages
- Identifies large files
- Recommends optimization

### Global Settings
- Validates site name
- Checks contact completeness
- Reviews branding setup
- Ensures consistency

## Troubleshooting

### Common Issues

**Problem: Low SEO score despite adding meta tags**
- **Solution**: Check tag LENGTH (not just presence)
- **Fix**: Optimize to 50-60 chars (title) and 150-160 (description)

**Problem: Accessibility score stuck at 80**
- **Solution**: Check ALL images have alt text
- **Fix**: Review each gallery and image component

**Problem: Performance score declining**
- **Solution**: Check recently added assets
- **Fix**: Compress images, reduce gallery sizes

**Problem: Issues not disappearing after fixes**
- **Solution**: Close and reopen Analytics dialog
- **Note**: Analysis runs on dialog open

**Problem: Export not downloading**
- **Solution**: Check browser download settings
- **Fix**: Allow downloads from site

### Performance Tips

**If Analytics is Slow:**
- Close other dialogs
- Reduce number of pages/components
- Clear browser cache
- Restart browser

**If Scores Seem Wrong:**
- Refresh analytics (close/reopen)
- Verify fixes were saved
- Check current page vs all pages
- Ensure latest project state

## Advanced Features (Future)

Potential enhancements:

### Historical Tracking
- **Score trends** over time
- **Graph visualizations**
- **Regression detection**
- **Improvement tracking**

### Custom Rules
- **Configure thresholds**
- **Custom checks**
- **Team-specific rules**
- **Brand guidelines**

### Automated Fixes
- **One-click optimization**
- **Batch image compression**
- **Auto-generate meta tags**
- **AI-powered suggestions**

### Competitive Analysis
- **Compare with competitors**
- **Industry benchmarks**
- **Best-in-class examples**
- **Goal setting**

### Real-Time Monitoring
- **Live score updates** as you build
- **Instant issue detection**
- **Proactive warnings**
- **Smart suggestions**

## Accessibility Compliance

### WCAG 2.1 Guidelines

**Level A (Must Have):**
- ✓ Alt text on images
- ✓ Keyboard navigation
- ✓ Sufficient contrast
- ✓ Form labels

**Level AA (Recommended):**
- ✓ Enhanced contrast (4.5:1)
- ✓ Resize text to 200%
- ✓ Multiple navigation methods
- ✓ Consistent navigation

**Level AAA (Best Practice):**
- ✓ Highest contrast (7:1)
- ✓ Advanced audio descriptions
- ✓ Sign language support

### Legal Compliance

**Why It Matters:**
- **ADA compliance** (US law)
- **Section 508** (government)
- **WCAG 2.1** (international standard)
- **Avoid lawsuits**
- **Inclusive design**

## SEO Best Practices

### On-Page SEO Checklist

**Every Page Should Have:**
- ✓ Unique meta title
- ✓ Unique meta description
- ✓ One H1 heading
- ✓ Descriptive URLs
- ✓ Alt text on images
- ✓ Internal links
- ✓ Mobile-friendly design

### Local SEO (Restaurants)

**Critical Elements:**
- ✓ Business name
- ✓ Complete address
- ✓ Phone number
- ✓ Business hours
- ✓ Google Maps integration
- ✓ Schema markup (future)
- ✓ Reviews integration (future)

### Meta Tag Templates

**Restaurant Homepage:**
```
Title: "{Restaurant Name} | {Cuisine Type} in {City}"
Description: "{Brief description of cuisine and atmosphere}. 
{Unique selling point}. {Call to action} in {neighborhood}, {city}."
```

**Menu Page:**
```
Title: "Menu | {Restaurant Name} - {City} {Cuisine}"
Description: "Explore our {cuisine type} menu featuring 
{signature dishes}. Fresh {ingredients}, {cooking style}. 
View full menu and prices."
```

## Performance Benchmarks

### Target Metrics

**Excellent Performance:**
- Load time: < 2 seconds
- Total size: < 1 MB
- Images: All < 500 KB
- Score: 90-100

**Good Performance:**
- Load time: 2-3 seconds
- Total size: 1-2 MB
- Most images < 500 KB
- Score: 70-89

**Needs Improvement:**
- Load time: > 3 seconds
- Total size: > 2 MB
- Many large images
- Score: < 70

### Industry Standards

**Restaurant Websites:**
- Avg load: 3.5 seconds
- Avg size: 2.3 MB
- Target: Beat average!

**Mobile Performance:**
- Critical: < 3s on 4G
- Most visitors on mobile
- Optimize images first

## Conclusion

The Analytics & Optimization system provides restaurant owners with professional-grade insights into their website's health. By automatically analyzing SEO, accessibility, and performance, it empowers non-technical users to create websites that rank well in search engines, work for all users, and load quickly.

**Key Benefits:**
- ✅ Improve search rankings
- ✅ Ensure accessibility compliance
- ✅ Optimize loading speed
- ✅ Track component usage
- ✅ Identify issues early
- ✅ Export professional reports
- ✅ No technical knowledge required
- ✅ Actionable recommendations

**Best Practice Summary:**
1. Check analytics weekly
2. Fix critical issues first
3. Aim for 90+ scores
4. Export reports for records
5. Monitor trends over time
6. Optimize before launch
7. Maintain after launch

The system makes professional website optimization accessible to everyone, ensuring restaurant websites are fast, accessible, and search-engine friendly.
