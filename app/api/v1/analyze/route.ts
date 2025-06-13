import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { WebsiteAnalyzer } from '@/lib/analyzers/basic-analyzer';
import { RateLimiter } from '@/lib/services/rate-limiter';

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
    const isAuthenticated = !!userId;
    
    // Parse and validate input
    const body = await request.json();
    const { url } = analyzeSchema.parse(body);
    
    // Get identifier for rate limiting
    const identifier = userId || 
                      request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') ||
                      request.ip || 
                      'anonymous';
    
    console.log('Analyzing for identifier:', identifier, 'Authenticated:', isAuthenticated);
    
    // Check rate limits BEFORE analysis
    const rateLimiter = new RateLimiter();
    const { allowed, remaining, limit, resetAt } = await rateLimiter.checkLimit(
      identifier, 
      isAuthenticated
    );
    
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Free users can analyze 3 websites per day. Sign in for unlimited analyses.',
          remaining: 0,
          limit,
          resetAt
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetAt.toISOString()
          }
        }
      );
    }
    
    // Record usage BEFORE analysis (for anonymous users)
    if (!userId) {
      await rateLimiter.recordUsage(identifier, url);
    }
    
    // Create analyzer instance
    const analyzer = new WebsiteAnalyzer();
    
    try {
      // Run REAL analysis
      console.log('Starting analysis for:', url);
      const analysisResult = await analyzer.analyze(url);
      
      // Save full results for authenticated users
      if (userId) {
        await prisma.analysis.create({
          data: {
            url,
            userId,
            seoScore: analysisResult.scores.seo,
            aiScore: analysisResult.scores.ai,
            overallScore: analysisResult.scores.overall,
            technicalSeo: JSON.stringify(analysisResult.technical),
            onPageSeo: JSON.stringify(analysisResult.onPage),
            aiOptimization: JSON.stringify(analysisResult.aiOptimization),
            recommendations: JSON.stringify(analysisResult.topRecommendations)
          }
        });
      }
      
      // Add rate limit info to response
      const responseData = {
        ...analysisResult,
        rateLimit: {
          remaining: isAuthenticated ? 'unlimited' : remaining - 1,
          limit: isAuthenticated ? 'unlimited' : limit,
          resetAt
        }
      };
      
      // Return the analysis result with rate limit headers
      return NextResponse.json(responseData, {
        headers: {
          'X-RateLimit-Limit': isAuthenticated ? 'unlimited' : limit.toString(),
          'X-RateLimit-Remaining': isAuthenticated ? 'unlimited' : (remaining - 1).toString(),
          'X-RateLimit-Reset': resetAt.toISOString()
        }
      });
      
    } catch (analysisError: any) {
      console.error('Analysis error:', analysisError);
      
      // If analysis fails, remove the usage record for anonymous users
      if (!userId) {
        try {
          await prisma.analysis.deleteMany({
            where: {
              url,
              ipAddress: identifier,
              createdAt: {
                gte: new Date(Date.now() - 60000) // Within last minute
              }
            }
          });
        } catch (e) {
          console.error('Failed to cleanup failed analysis record:', e);
        }
      }
      
      // Handle specific errors
      if (analysisError.message?.includes('net::ERR_NAME_NOT_RESOLVED')) {
        return NextResponse.json(
          { error: 'Website not found. Please check the URL and try again.' },
          { status: 404 }
        );
      }
      
      if (analysisError.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'Website took too long to load. Please try again.' },
          { status: 408 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { error: 'Failed to analyze website. Please ensure the URL is accessible.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }
    
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}