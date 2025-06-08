import { NextRequest, NextResponse } from 'next/server'
import { analyzeWebsite } from '@/lib/analyzers/basic-analyzer'
import { prisma } from '@/lib/db'
import { rateLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      )
    }
    
    // Rate limiting - use IP address as identifier
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success, limit, reset, remaining } = await rateLimiter.limit(ip)
    
    // Add rate limit info to response headers
    const response = new NextResponse()
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Free users can analyze 3 websites per day. Please try again tomorrow or upgrade to Pro for unlimited analyses.',
          limit,
          remaining,
          reset: new Date(reset).toISOString()
        },
        { 
          status: 429,
          headers: response.headers 
        }
      )
    }
    
    // Analyze the website
    const analysis = await analyzeWebsite(url)
    
    // Store in database
    await prisma.analysis.create({
      data: {
        url,
        seoScore: analysis.scores.seo,
        aiScore: analysis.scores.ai,
        overallScore: analysis.scores.overall,
        technicalSeo: {},
        onPageSeo: {
          title: analysis.title,
          metaDescription: analysis.metaDescription,
          h1: analysis.h1,
          h2Count: analysis.h2Count,
          imageStats: analysis.imageStats,
          linkStats: analysis.linkStats
        },
        aiOptimization: {},
        recommendations: [...analysis.issues, ...analysis.suggestions]
      }
    })
    
    // Return analysis with rate limit headers
    return NextResponse.json(analysis, {
      headers: response.headers
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
}