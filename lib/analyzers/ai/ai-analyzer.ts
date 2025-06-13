import { ScrapedData } from '@/lib/services/scraper';

export interface AIAnalysis {
  score: number;
  readability: number;
  structure: number;
  citationPotential: number;
  details: {
    issues: string[];
    suggestions: string[];
    metrics: Record<string, any>;
  };
}

export class AIAnalyzer {
  analyze(data: ScrapedData): AIAnalysis {
    const readability = this.calculateReadability(data);
    const structure = this.calculateStructure(data);
    const citationPotential = this.calculateCitationPotential(data);
    
    const score = Math.round((readability + structure + citationPotential) / 3);
    
    const { issues, suggestions } = this.generateInsights(data, {
      readability,
      structure,
      citationPotential
    });
    
    return {
      score,
      readability,
      structure,
      citationPotential,
      details: {
        issues,
        suggestions,
        metrics: {
          hasQuestions: this.detectQuestions(data),
          hasFAQ: this.detectFAQ(data),
          hasStructuredData: data.structuredData.length > 0,
          avgParagraphLength: this.getAvgParagraphLength(data),
          hasDefinitions: this.detectDefinitions(data)
        }
      }
    };
  }

  private calculateReadability(data: ScrapedData): number {
    let score = 70;
    
    // Check for clear sections
    if (data.headings.h2.length > 3) score += 10;
    
    // Check for lists
    const hasLists = data.html.includes('<ul>') || data.html.includes('<ol>');
    if (hasLists) score += 10;
    
    // Check paragraph structure
    const avgParagraphLength = this.getAvgParagraphLength(data);
    if (avgParagraphLength > 50 && avgParagraphLength < 150) score += 10;
    
    return Math.min(100, score);
  }

  private calculateStructure(data: ScrapedData): number {
    let score = 60;
    
    // Has clear hierarchy
    if (data.headings.h1.length === 1 && data.headings.h2.length > 0) {
      score += 15;
    }
    
    // Has structured data
    if (data.structuredData.length > 0) {
      score += 20;
      
      // Bonus for FAQ or HowTo schema
      const hasFAQSchema = data.structuredData.some(
        sd => sd['@type'] === 'FAQPage' || sd['@type'] === 'HowTo'
      );
      if (hasFAQSchema) score += 15;
    }
    
    return Math.min(100, score);
  }

  private calculateCitationPotential(data: ScrapedData): number {
    let score = 50;
    
    // Has questions and answers
    if (this.detectQuestions(data)) score += 20;
    
    // Has statistics or data
    const hasStats = /\d+%|\d+\s*(million|billion|thousand)/i.test(data.text);
    if (hasStats) score += 15;
    
    // Has recent dates
    const currentYear = new Date().getFullYear();
    const hasRecentDates = data.text.includes(String(currentYear)) || 
                          data.text.includes(String(currentYear - 1));
    if (hasRecentDates) score += 15;
    
    return Math.min(100, score);
  }

  private generateInsights(data: ScrapedData, scores: any) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Readability issues
    if (scores.readability < 70) {
      issues.push('Content structure is not optimized for AI parsing');
      suggestions.push('Break content into shorter paragraphs with clear headings');
    }
    
    // Structure issues
    if (!data.structuredData.length) {
      issues.push('No structured data found for AI engines');
      suggestions.push('Add FAQ or HowTo schema markup');
    }
    
    // Citation potential issues
    if (scores.citationPotential < 60) {
      issues.push('Low citation potential for AI engines');
      suggestions.push('Add Q&A sections and specific data points');
    }
    
    // Question detection
    if (!this.detectQuestions(data)) {
      issues.push('No question-answer format detected');
      suggestions.push('Structure content with clear questions and answers');
    }
    
    // FAQ detection
    if (!this.detectFAQ(data)) {
      suggestions.push('Consider adding a FAQ section for better AI visibility');
    }
    
    // Lists and formatting
    const hasLists = data.html.includes('<ul>') || data.html.includes('<ol>');
    if (!hasLists) {
      suggestions.push('Use bullet points or numbered lists for better AI comprehension');
    }
    
    return { issues, suggestions };
  }

  private detectQuestions(data: ScrapedData): boolean {
    return data.text.includes('?') || 
           data.headings.h2.some(h => h.includes('?')) ||
           data.headings.h3.some(h => h.includes('?'));
  }

  private detectFAQ(data: ScrapedData): boolean {
    const faqPatterns = /FAQ|frequently asked|common questions/i;
    return faqPatterns.test(data.text) || 
           data.headings.h2.some(h => faqPatterns.test(h));
  }

  private detectDefinitions(data: ScrapedData): boolean {
    const definitionPatterns = /what is|definition|means|refers to/i;
    return definitionPatterns.test(data.text);
  }

  private getAvgParagraphLength(data: ScrapedData): number {
    const paragraphs = data.text.split(/\n\n+/);
    const totalWords = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0);
    return totalWords / paragraphs.length;
  }
}