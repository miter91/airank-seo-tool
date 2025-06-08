import { NextRequest, NextResponse } from 'next/server'
import { analyzeWebsite } from '@/lib/analyzers/basic-analyzer'
import { prisma } from '@/lib/db'

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
    
    // Analyze the website
    const analysis = await analyzeWebsite(url)
    
    // Store in database (optional for now)
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
          h1: analysis.h1
        },
        aiOptimization: {},
        recommendations: [...analysis.issues, ...analysis.suggestions]
      }
    })
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
}