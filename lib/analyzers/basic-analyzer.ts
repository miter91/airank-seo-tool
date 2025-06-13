import { WebsiteScraper } from '@/lib/services/scraper';
import { SEOAnalyzer } from './seo/seo-analyzer';
import { AIAnalyzer } from './ai/ai-analyzer';

export class WebsiteAnalyzer {
  private scraper: WebsiteScraper;
  private seoAnalyzer: SEOAnalyzer;
  private aiAnalyzer: AIAnalyzer;

  constructor() {
    this.scraper = new WebsiteScraper();
    this.seoAnalyzer = new SEOAnalyzer();
    this.aiAnalyzer = new AIAnalyzer();
  }

  async analyze(url: string) {
    try {
      // Scrape the website
      const scrapedData = await this.scraper.scrape(url);
      
      // Run SEO analysis
      const seoAnalysis = this.seoAnalyzer.analyze(scrapedData);
      
      // Run AI analysis
      const aiAnalysis = this.aiAnalyzer.analyze(scrapedData);
      
      // Compile results
      return {
        url,
        timestamp: new Date().toISOString(),
        scores: {
          seo: seoAnalysis.score,
          ai: aiAnalysis.score,
          overall: Math.round((seoAnalysis.score + aiAnalysis.score) / 2)
        },
        technical: seoAnalysis.technical,
        onPage: seoAnalysis.onPage,
        aiOptimization: {
          readability: aiAnalysis.readability,
          structure: aiAnalysis.structure,
          citationPotential: aiAnalysis.citationPotential,
          overallScore: aiAnalysis.score,
          details: aiAnalysis.details
        },
        topRecommendations: this.generateTopRecommendations(seoAnalysis, aiAnalysis)
      };
    } finally {
      await this.scraper.cleanup();
    }
  }

  private generateTopRecommendations(seo: any, ai: any): string[] {
    const recommendations: Array<{priority: number; text: string}> = [];
    
    // Add critical SEO issues
    seo.technical.issues.forEach((issue: string) => {
      recommendations.push({ priority: 1, text: `Critical: ${issue}` });
    });
    
    // Add AI optimization issues  
    ai.details.issues.forEach((issue: string) => {
      recommendations.push({ priority: 2, text: `High: ${issue}` });
    });
    
    // Add suggestions
    [...seo.technical.suggestions, ...seo.onPage.suggestions].forEach((suggestion: string) => {
      recommendations.push({ priority: 3, text: `Medium: ${suggestion}` });
    });
    
    // Sort by priority and take top 6
    return recommendations
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 6)
      .map(r => r.text);
  }
}