import axios from 'axios'
import * as cheerio from 'cheerio'

export interface SEOAnalysis {
  url: string
  title: string
  metaDescription: string
  h1: string[]
  scores: {
    seo: number
    ai: number
    overall: number
  }
  issues: string[]
  suggestions: string[]
}

export async function analyzeWebsite(url: string): Promise<SEOAnalysis> {
  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
      }
    })
    
    const $ = cheerio.load(response.data)
    
    // Extract SEO elements
    const title = $('title').text() || ''
    const metaDescription = $('meta[name="description"]').attr('content') || ''
    const h1s = $('h1').map((_, el) => $(el).text()).get()
    
    // Basic scoring
    let seoScore = 100
    const issues: string[] = []
    const suggestions: string[] = []
    
    // Title checks
    if (!title) {
      issues.push('Missing title tag')
      seoScore -= 20
    } else if (title.length > 60) {
      issues.push(`Title too long (${title.length} characters, recommended: 50-60)`)
      seoScore -= 5
    } else if (title.length < 30) {
      suggestions.push('Title might be too short for optimal SEO')
      seoScore -= 3
    }
    
    // Meta description checks
    if (!metaDescription) {
      issues.push('Missing meta description')
      seoScore -= 15
    } else if (metaDescription.length > 160) {
      issues.push(`Meta description too long (${metaDescription.length} characters, recommended: 150-160)`)
      seoScore -= 5
    }
    
    // H1 checks
    if (h1s.length === 0) {
      issues.push('No H1 tag found')
      seoScore -= 15
    } else if (h1s.length > 1) {
      issues.push(`Multiple H1 tags found (${h1s.length}). Use only one H1 per page`)
      seoScore -= 10
    }
    
    // Basic AI score (we'll enhance this later)
    let aiScore = 70
    if (metaDescription && metaDescription.length > 100) {
      aiScore += 10
    }
    if (h1s.length === 1) {
      aiScore += 10
    }
    
    // Calculate overall score
    const overall = Math.round((seoScore + aiScore) / 2)
    
    return {
      url,
      title,
      metaDescription,
      h1: h1s,
      scores: {
        seo: Math.max(0, seoScore),
        ai: aiScore,
        overall
      },
      issues,
      suggestions
    }
  } catch (error) {
    throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}