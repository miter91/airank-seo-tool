import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const analyzeSchema = z.object({
  url: z.string().url().refine(url => url.startsWith('http'), {
    message: 'URL must start with http:// or https://'
  })
});

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Parse and validate input
    const body = await request.json();
    const { url } = analyzeSchema.parse(body);
    
    // Enhanced mock analysis with more detailed insights
    const mockAnalysis = {
      url,
      timestamp: new Date().toISOString(),
      scores: {
        seo: Math.floor(Math.random() * 30) + 70, // 70-100
        ai: Math.floor(Math.random() * 30) + 60,  // 60-90
        overall: 0
      },
      technical: {
        score: Math.floor(Math.random() * 30) + 70,
        issues: [
          'Page load time is 4.2s (should be under 3s)',
          'Missing HTTPS protocol',
          'No XML sitemap found',
          'Robots.txt not configured properly',
          'Missing canonical tags'
        ],
        suggestions: [
          'Enable GZIP compression to reduce page size by 70%',
          'Optimize images - found 12 uncompressed images',
          'Implement browser caching for static assets',
          'Minify CSS and JavaScript files',
          'Use a CDN for faster content delivery'
        ],
        details: { 
          loadTime: 4.2,
          pageSize: '3.2MB',
          requests: 87,
          mobileScore: 65
        }
      },
      onPage: {
        score: Math.floor(Math.random() * 30) + 70,
        issues: [
          'Title tag too long (72 characters, recommended: 50-60)',
          'Missing meta description',
          'No H1 tag found on the page',
          '8 images missing alt text',
          'Multiple H1 tags detected (should only have one)',
          'Thin content - main content has only 245 words'
        ],
        suggestions: [
          'Add descriptive meta description (150-160 characters)',
          'Create a clear H1 that includes your main keyword',
          'Add alt text to all images for better accessibility',
          'Increase content length to at least 800 words',
          'Add internal links to related pages',
          'Use H2-H6 tags to structure your content properly'
        ],
        details: { 
          titleLength: 72,
          metaDescriptionLength: 0,
          h1Count: 0,
          h2Count: 3,
          wordCount: 245,
          imagesWithoutAlt: 8,
          internalLinks: 2,
          externalLinks: 5
        }
      },
      aiOptimization: {
        readability: Math.floor(Math.random() * 30) + 70,
        structure: Math.floor(Math.random() * 30) + 70,
        citationPotential: Math.floor(Math.random() * 30) + 60,
        overallScore: 0,
        details: {
          issues: [
            'Content lacks clear question-answer format',
            'No structured data (Schema.org) implemented',
            'Missing FAQ section for common queries',
            'Content not optimized for featured snippets',
            'No clear definitions or explanations of key terms'
          ],
          suggestions: [
            'Add an FAQ section with 5-10 common questions',
            'Implement Article or HowTo schema markup',
            'Use bullet points and numbered lists for better AI parsing',
            'Add a "Quick Answer" section at the beginning',
            'Include data tables for statistical information',
            'Write in a more conversational, Q&A style'
          ]
        }
      },
      topRecommendations: [
        'Critical: Add meta description - impacts CTR in search results',
        'High Priority: Optimize page speed - currently 4.2s (lose 40% of visitors)',
        'High Priority: Add H1 tag with main keyword',
        'Medium: Add alt text to 8 images for accessibility and SEO',
        'Medium: Implement structured data for rich snippets',
        'Low: Expand content from 245 to 800+ words'
      ]
    };
    
    // Calculate overall scores
    mockAnalysis.scores.overall = Math.round(
      (mockAnalysis.scores.seo + mockAnalysis.scores.ai) / 2
    );
    
    mockAnalysis.aiOptimization.overallScore = Math.round(
      (mockAnalysis.aiOptimization.readability + 
       mockAnalysis.aiOptimization.structure + 
       mockAnalysis.aiOptimization.citationPotential) / 3
    );
    
    // If user is logged in, save to database
    if (userId) {
      try {
        await prisma.analysis.create({
          data: {
            url,
            userId,
            seoScore: mockAnalysis.scores.seo,
            aiScore: mockAnalysis.scores.ai,
            overallScore: mockAnalysis.scores.overall,
            technicalSeo: mockAnalysis.technical,
            onPageSeo: mockAnalysis.onPage,
            aiOptimization: mockAnalysis.aiOptimization,
            recommendations: mockAnalysis.topRecommendations
          }
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue without saving - don't fail the analysis
      }
    }
    
    // Return the analysis result
    return NextResponse.json(mockAnalysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }
    
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website. Please try again.' },
      { status: 500 }
    );
  }
}