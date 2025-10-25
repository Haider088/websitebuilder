import {
  Page,
  CanvasComponent,
  GlobalSettings,
  Asset,
  AnalyticsIssue,
  SEOScore,
  AccessibilityScore,
  PerformanceScore,
  PageStats,
  ComponentUsageStats,
  ProjectAnalytics,
} from '../types';

// SEO Analysis
export function analyzeSEO(pages: Page[], globalSettings: GlobalSettings): SEOScore {
  const issues: AnalyticsIssue[] = [];
  let score = 100;

  // Check each page for SEO issues
  pages.forEach((page) => {
    const meta = page.props || {};

    // Missing meta title
    if (!meta.metaTitle || meta.metaTitle.trim() === '') {
      issues.push({
        id: `seo-title-${page.id}`,
        type: 'seo',
        level: 'critical',
        title: `Missing meta title on "${page.name}"`,
        description: 'Page does not have a meta title, which is critical for SEO.',
        pageId: page.id,
        recommendation: 'Add a descriptive meta title (50-60 characters) in page settings.',
        impact: 'high',
      });
      score -= 15;
    } else if (meta.metaTitle.length < 30 || meta.metaTitle.length > 60) {
      issues.push({
        id: `seo-title-length-${page.id}`,
        type: 'seo',
        level: 'warning',
        title: `Meta title length issue on "${page.name}"`,
        description: `Meta title is ${meta.metaTitle.length} characters. Optimal length is 50-60 characters.`,
        pageId: page.id,
        recommendation: 'Adjust meta title to be between 50-60 characters for best results.',
        impact: 'medium',
      });
      score -= 5;
    }

    // Missing meta description
    if (!meta.metaDescription || meta.metaDescription.trim() === '') {
      issues.push({
        id: `seo-desc-${page.id}`,
        type: 'seo',
        level: 'critical',
        title: `Missing meta description on "${page.name}"`,
        description: 'Page does not have a meta description.',
        pageId: page.id,
        recommendation: 'Add a compelling meta description (150-160 characters).',
        impact: 'high',
      });
      score -= 15;
    } else if (meta.metaDescription.length < 120 || meta.metaDescription.length > 160) {
      issues.push({
        id: `seo-desc-length-${page.id}`,
        type: 'seo',
        level: 'warning',
        title: `Meta description length issue on "${page.name}"`,
        description: `Meta description is ${meta.metaDescription.length} characters. Optimal is 150-160.`,
        pageId: page.id,
        recommendation: 'Adjust meta description to be between 150-160 characters.',
        impact: 'medium',
      });
      score -= 5;
    }

    // Check for heading hierarchy
    const components = page.components;
    const hasHeading = components.some((c) => 
      ['hero-full', 'hero-split', 'text'].includes(c.componentId)
    );

    if (!hasHeading && components.length > 0) {
      issues.push({
        id: `seo-heading-${page.id}`,
        type: 'seo',
        level: 'warning',
        title: `No clear heading on "${page.name}"`,
        description: 'Page should have a clear H1 heading for SEO.',
        pageId: page.id,
        recommendation: 'Add a hero section or heading component at the top of the page.',
        impact: 'medium',
      });
      score -= 5;
    }
  });

  // Check global settings
  if (!globalSettings.branding.siteName || globalSettings.branding.siteName === 'My Restaurant') {
    issues.push({
      id: 'seo-sitename',
      type: 'seo',
      level: 'warning',
      title: 'Generic site name',
      description: 'Site is using the default name "My Restaurant".',
      recommendation: 'Update site name in Global Settings to your restaurant\'s actual name.',
      impact: 'medium',
    });
    score -= 5;
  }

  if (!globalSettings.contact.address || !globalSettings.contact.phone) {
    issues.push({
      id: 'seo-contact',
      type: 'seo',
      level: 'info',
      title: 'Missing contact information',
      description: 'Complete contact info helps with local SEO.',
      recommendation: 'Add address and phone number in Global Settings for better local search visibility.',
      impact: 'medium',
    });
    score -= 3;
  }

  const recommendations = generateSEORecommendations(issues);

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}

// Accessibility Analysis
export function analyzeAccessibility(pages: Page[]): AccessibilityScore {
  const issues: AnalyticsIssue[] = [];
  let score = 100;

  pages.forEach((page) => {
    const components = page.components;

    // Check for images without alt text
    components.forEach((comp) => {
      if (['gallery', 'image'].includes(comp.componentId)) {
        const images = comp.props?.images || [];
        images.forEach((img: any, idx: number) => {
          if (!img.alt || img.alt.trim() === '') {
            issues.push({
              id: `a11y-alt-${comp.id}-${idx}`,
              type: 'accessibility',
              level: 'critical',
              title: 'Image missing alt text',
              description: `Image in "${comp.name}" on "${page.name}" is missing alt text.`,
              pageId: page.id,
              componentId: comp.id,
              recommendation: 'Add descriptive alt text to all images for screen reader users.',
              impact: 'high',
            });
            score -= 10;
          }
        });
      }

      // Check for low contrast (simplified check)
      if (comp.props?.backgroundColor && comp.props?.textColor) {
        // This is a simplified check - in production, use actual contrast ratio calculation
        const bgColor = comp.props.backgroundColor;
        const textColor = comp.props.textColor;
        
        if (bgColor === textColor) {
          issues.push({
            id: `a11y-contrast-${comp.id}`,
            type: 'accessibility',
            level: 'critical',
            title: 'Insufficient color contrast',
            description: `Component "${comp.name}" may have contrast issues.`,
            pageId: page.id,
            componentId: comp.id,
            recommendation: 'Ensure text has sufficient contrast ratio (4.5:1 minimum).',
            impact: 'high',
          });
          score -= 8;
        }
      }
    });

    // Check for form accessibility
    const formComponents = components.filter((c) => 
      ['contact-form', 'newsletter', 'reservation'].includes(c.componentId)
    );

    formComponents.forEach((form) => {
      if (form.formConfig) {
        const hasRequiredFields = form.formConfig.fields.some(f => f.required);
        const hasLabels = form.formConfig.fields.every(f => f.label && f.label.trim() !== '');

        if (!hasLabels) {
          issues.push({
            id: `a11y-labels-${form.id}`,
            type: 'accessibility',
            level: 'critical',
            title: 'Form inputs missing labels',
            description: `Form "${form.name}" has inputs without labels.`,
            pageId: page.id,
            componentId: form.id,
            recommendation: 'All form inputs must have associated labels for accessibility.',
            impact: 'high',
          });
          score -= 10;
        }
      }
    });

    // Check for skip navigation
    if (components.length > 5 && page.slug === 'home') {
      const hasNav = components.some((c) => c.componentId === 'navbar');
      if (hasNav) {
        issues.push({
          id: 'a11y-skip-nav',
          type: 'accessibility',
          level: 'info',
          title: 'Consider adding skip navigation',
          description: 'Pages with navigation should include a skip link for keyboard users.',
          pageId: page.id,
          recommendation: 'Add a "Skip to main content" link at the top of the page.',
          impact: 'low',
        });
        score -= 2;
      }
    }
  });

  const recommendations = generateA11yRecommendations(issues);

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}

// Performance Analysis
export function analyzePerformance(
  pages: Page[],
  assets: Asset[]
): PerformanceScore {
  const issues: AnalyticsIssue[] = [];
  let score = 100;

  // Calculate total size
  const assetSize = assets.reduce((sum, asset) => sum + (asset.size || 0), 0);
  const estimatedHtmlSize = JSON.stringify(pages).length / 1024; // KB
  const totalSize = assetSize / 1024 + estimatedHtmlSize; // KB

  // Check asset sizes
  const largeAssets = assets.filter((a) => a.size > 500000); // > 500KB

  largeAssets.forEach((asset) => {
    issues.push({
      id: `perf-large-asset-${asset.id}`,
      type: 'performance',
      level: 'warning',
      title: 'Large asset detected',
      description: `Asset "${asset.name}" is ${(asset.size / 1024 / 1024).toFixed(2)}MB.`,
      recommendation: 'Optimize images to under 500KB. Use WebP format or compress images.',
      impact: 'high',
    });
    score -= 8;
  });

  // Check number of assets
  if (assets.length > 30) {
    issues.push({
      id: 'perf-asset-count',
      type: 'performance',
      level: 'warning',
      title: 'Too many assets',
      description: `Project has ${assets.length} assets, which may slow load times.`,
      recommendation: 'Consider lazy loading images or reducing the number of images per page.',
      impact: 'medium',
    });
    score -= 5;
  }

  // Check page complexity
  pages.forEach((page) => {
    const componentCount = page.components.length;

    if (componentCount > 20) {
      issues.push({
        id: `perf-components-${page.id}`,
        type: 'performance',
        level: 'info',
        title: `Many components on "${page.name}"`,
        description: `Page has ${componentCount} components.`,
        pageId: page.id,
        recommendation: 'Consider splitting content across multiple pages for better performance.',
        impact: 'low',
      });
      score -= 3;
    }

    // Check for heavy components
    const galleries = page.components.filter((c) => c.componentId === 'gallery');
    galleries.forEach((gallery) => {
      const imageCount = gallery.props?.images?.length || 0;
      if (imageCount > 12) {
        issues.push({
          id: `perf-gallery-${gallery.id}`,
          type: 'performance',
          level: 'warning',
          title: 'Gallery has many images',
          description: `Gallery on "${page.name}" has ${imageCount} images.`,
          pageId: page.id,
          componentId: gallery.id,
          recommendation: 'Implement lazy loading or pagination for galleries with many images.',
          impact: 'medium',
        });
        score -= 5;
      }
    });
  });

  // Estimate load time (very rough estimate)
  const estimatedLoadTime = Math.min(10000, totalSize * 10 + pages.length * 50);

  if (estimatedLoadTime > 3000) {
    issues.push({
      id: 'perf-load-time',
      type: 'performance',
      level: 'warning',
      title: 'Slow estimated load time',
      description: `Estimated load time is ${(estimatedLoadTime / 1000).toFixed(1)}s.`,
      recommendation: 'Optimize images and reduce page complexity to improve load times.',
      impact: 'high',
    });
    score -= 10;
  }

  const recommendations = generatePerfRecommendations(issues);

  return {
    score: Math.max(0, score),
    estimatedLoadTime,
    totalSize,
    imageSize: assetSize / 1024,
    issues,
    recommendations,
  };
}

// Component Usage Statistics
export function analyzeComponentUsage(pages: Page[]): ComponentUsageStats[] {
  const usageMap = new Map<string, ComponentUsageStats>();

  pages.forEach((page) => {
    page.components.forEach((comp) => {
      const existing = usageMap.get(comp.componentId);

      if (existing) {
        existing.count++;
        if (!existing.pages.includes(page.name)) {
          existing.pages.push(page.name);
        }
      } else {
        usageMap.set(comp.componentId, {
          componentId: comp.componentId,
          name: comp.name,
          count: 1,
          pages: [page.name],
        });
      }
    });
  });

  return Array.from(usageMap.values()).sort((a, b) => b.count - a.count);
}

// Page Statistics
export function analyzePageStats(pages: Page[]): PageStats[] {
  return pages.map((page) => {
    const components = page.components;
    const forms = components.filter((c) =>
      ['contact-form', 'newsletter', 'reservation'].includes(c.componentId)
    );
    
    let imageCount = 0;
    components.forEach((c) => {
      if (c.componentId === 'gallery') {
        imageCount += c.props?.images?.length || 0;
      } else if (c.componentId === 'image') {
        imageCount += 1;
      }
    });

    const meta = page.props || {};
    const estimatedSize = JSON.stringify(page).length / 1024;

    return {
      id: page.id,
      name: page.name,
      componentCount: components.length,
      formCount: forms.length,
      imageCount,
      hasMetaDescription: !!(meta.metaDescription && meta.metaDescription.trim()),
      hasMetaTitle: !!(meta.metaTitle && meta.metaTitle.trim()),
      estimatedSize,
    };
  });
}

// Generate complete analytics
export function generateAnalytics(
  pages: Page[],
  globalSettings: GlobalSettings,
  assets: Asset[]
): ProjectAnalytics {
  const componentUsage = analyzeComponentUsage(pages);
  const pageStats = analyzePageStats(pages);
  const seo = analyzeSEO(pages, globalSettings);
  const accessibility = analyzeAccessibility(pages);
  const performance = analyzePerformance(pages, assets);

  const totalComponents = pages.reduce((sum, page) => sum + page.components.length, 0);
  const totalForms = pages.reduce(
    (sum, page) =>
      sum +
      page.components.filter((c) =>
        ['contact-form', 'newsletter', 'reservation'].includes(c.componentId)
      ).length,
    0
  );

  const projectSize = JSON.stringify({ pages, globalSettings }).length / 1024;

  // Combine all issues
  const allIssues = [
    ...seo.issues,
    ...accessibility.issues,
    ...performance.issues,
  ].sort((a, b) => {
    const levelOrder = { critical: 0, warning: 1, info: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  return {
    overview: {
      totalPages: pages.length,
      totalComponents,
      totalForms,
      totalAssets: assets.length,
      projectSize,
      lastAnalyzed: Date.now(),
    },
    componentUsage,
    pageStats,
    seo,
    accessibility,
    performance,
    issues: allIssues,
  };
}

// Helper functions for recommendations
function generateSEORecommendations(issues: AnalyticsIssue[]): string[] {
  const recs: string[] = [];

  if (issues.some((i) => i.id.includes('seo-title'))) {
    recs.push('Add unique, descriptive meta titles to all pages (50-60 characters)');
  }
  if (issues.some((i) => i.id.includes('seo-desc'))) {
    recs.push('Write compelling meta descriptions for all pages (150-160 characters)');
  }
  if (issues.some((i) => i.id === 'seo-sitename')) {
    recs.push('Update your site name to match your restaurant\'s brand');
  }
  if (issues.some((i) => i.id === 'seo-contact')) {
    recs.push('Add complete contact information for better local SEO');
  }

  if (recs.length === 0) {
    recs.push('Your SEO setup looks good! Keep meta data updated as you add content.');
  }

  return recs;
}

function generateA11yRecommendations(issues: AnalyticsIssue[]): string[] {
  const recs: string[] = [];

  if (issues.some((i) => i.id.includes('a11y-alt'))) {
    recs.push('Add descriptive alt text to all images for screen reader users');
  }
  if (issues.some((i) => i.id.includes('a11y-contrast'))) {
    recs.push('Ensure sufficient color contrast (4.5:1 minimum for text)');
  }
  if (issues.some((i) => i.id.includes('a11y-labels'))) {
    recs.push('Add proper labels to all form inputs');
  }

  if (recs.length === 0) {
    recs.push('Your accessibility is in good shape! Continue following best practices.');
  }

  return recs;
}

function generatePerfRecommendations(issues: AnalyticsIssue[]): string[] {
  const recs: string[] = [];

  if (issues.some((i) => i.id.includes('perf-large-asset'))) {
    recs.push('Compress large images - aim for under 500KB per image');
  }
  if (issues.some((i) => i.id === 'perf-asset-count')) {
    recs.push('Consider lazy loading images or using fewer images per page');
  }
  if (issues.some((i) => i.id.includes('perf-components'))) {
    recs.push('Split complex pages into multiple pages for better performance');
  }
  if (issues.some((i) => i.id === 'perf-load-time')) {
    recs.push('Optimize overall page weight - target under 2MB total');
  }

  if (recs.length === 0) {
    recs.push('Performance looks good! Continue monitoring as you add content.');
  }

  return recs;
}
