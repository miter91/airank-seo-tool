import { ScrapedData } from '@/lib/services/scraper';

export interface SEOAnalysis {
  score: number;
  technical: {
    score: number;
    issues: string[];
    suggestions: string[];
    details: Record<string, any>;
  };
  onPage: {
    score: number;
    issues: string[];
    suggestions: string[];
    details: Record<string, any>;
  };
}

export class SEOAnalyzer {
  analyze(data: ScrapedData): SEOAnalysis {
    const technical = this.analyzeTechnical(data);
    const onPage = this.analyzeOnPage(data);
    
    const score = Math.round((technical.score + onPage.score) / 2);
    
    return {
      score,
      technical,
      onPage
    };
  }

  private analyzeTechnical(data: ScrapedData) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: Record<string, any> = {};
    let score = 100;

    // Check HTTPS
    if (!data.url.startsWith('https://')) {
      issues.push('Website is not using HTTPS');
      score -= 20;
    }

    // Check load time
    details.loadTime = (data.performance.loadTime / 1000).toFixed(2) + 's';
    if (data.performance.loadTime > 3000) {
      issues.push(`Page load time is ${details.loadTime} (should be under 3s)`);
      suggestions.push('Optimize images and enable compression to improve load time');
      score -= 15;
    }

    // Check page size
    details.pageSize = (data.performance.pageSize / 1024 / 1024).toFixed(2) + 'MB';
    if (data.performance.pageSize > 3 * 1024 * 1024) {
      issues.push(`Page size is ${details.pageSize} (should be under 3MB)`);
      suggestions.push('Compress images and minify CSS/JavaScript');
      score -= 10;
    }

    // Check structured data
    details.structuredDataCount = data.structuredData.length;
    if (data.structuredData.length === 0) {
      suggestions.push('Add structured data (Schema.org) to improve search visibility');
      score -= 5;
    }

    // Check status code
    if (data.statusCode !== 200) {
      issues.push(`Page returned ${data.statusCode} status code`);
      score -= 20;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details
    };
  }

  private analyzeOnPage(data: ScrapedData) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: Record<string, any> = {};
    let score = 100;

    // Title analysis
    details.titleLength = data.title.length;
    if (!data.title) {
      issues.push('Missing page title');
      score -= 20;
    } else if (data.title.length > 60) {
      issues.push(`Title too long (${data.title.length} chars, recommended: 50-60)`);
      score -= 5;
    } else if (data.title.length < 30) {
      suggestions.push(`Title might be too short (${data.title.length} chars)`);
      score -= 3;
    }

    // Meta description
    details.metaDescriptionLength = data.metaDescription.length;
    if (!data.metaDescription) {
      issues.push('Missing meta description');
      suggestions.push('Add a compelling meta description (150-160 characters)');
      score -= 15;
    } else if (data.metaDescription.length > 160) {
      issues.push(`Meta description too long (${data.metaDescription.length} chars)`);
      score -= 5;
    }

    // H1 analysis
    details.h1Count = data.headings.h1.length;
    if (data.headings.h1.length === 0) {
      issues.push('No H1 tag found');
      suggestions.push('Add one clear H1 tag with your main keyword');
      score -= 15;
    } else if (data.headings.h1.length > 1) {
      issues.push(`Multiple H1 tags found (${data.headings.h1.length})`);
      suggestions.push('Use only one H1 tag per page');
      score -= 10;
    }

    // H2 analysis
    details.h2Count = data.headings.h2.length;
    if (data.headings.h2.length === 0) {
      suggestions.push('Add H2 tags to structure your content');
      score -= 5;
    }

    // Images
    details.totalImages = data.images.total;
    details.imagesWithoutAlt = data.images.withoutAlt;
    if (data.images.withoutAlt > 0) {
      issues.push(`${data.images.withoutAlt} images missing alt text`);
      suggestions.push('Add descriptive alt text to all images');
      score -= Math.min(15, data.images.withoutAlt * 2);
    }

    // Links
    details.internalLinks = data.links.internal.length;
    details.externalLinks = data.links.external.length;
    if (data.links.internal.length < 3) {
      suggestions.push('Add more internal links to improve site navigation');
      score -= 5;
    }

    // Content length
    const wordCount = data.text.split(/\s+/).length;
    details.wordCount = wordCount;
    if (wordCount < 300) {
      issues.push(`Thin content detected (${wordCount} words)`);
      suggestions.push('Expand content to at least 500-800 words');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      details
    };
  }
}