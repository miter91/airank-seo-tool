import axios from 'axios'
import * as cheerio from 'cheerio'

export interface SEOAnalysis {
  url: string
  title: string
  metaDescription: string
  h1: string[]
  h2Count: number
  imageStats: {
    total: number
    withoutAlt: number
  }
  linkStats: {
    internal: number
    external: number
  }
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
      },
      timeout: 10000
    })
    
    const $ = cheerio.load(response.data)
    
    // Extract SEO elements
    const title = $('title').text() || ''
    const metaDescription = $('meta[name="description"]').attr('content') || ''
    const h1s = $('h1').map((_, el) => $(el).text()).get()
    const h2Count = $('h2').length
    
    // Image analysis
    const images = $('img')
    const imagesWithoutAlt = images.filter((_, el) => !$(el).attr('alt')).length
    
    // Link analysis
    const links = $('a[href]')
    let internalLinks = 0
    let externalLinks = 0
    
    links.each((_, el) => {
      const href = $(el).attr('href') || ''
      if (href.startsWith('http') && !href.includes(new URL(url).hostname)) {
        externalLinks++
      } else if (href.startsWith('/') || href.startsWith('#')) {
        internalLinks++
      }
    })
    
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
    } else if (metaDescription.length < 120) {
      suggestions.push('Meta description could be longer (aim for 150-160 characters)')
      seoScore -= 3
    }
    
    // H1 checks
    if (h1s.length === 0) {
      issues.push('No H1 tag found')
      seoScore -= 15
    } else if (h1s.length > 1) {
      issues.push(`Multiple H1 tags found (${h1s.length}). Use only one H1 per page`)
      seoScore -= 10
    }
    
    // H2 checks
    if (h2Count === 0) {
      suggestions.push('Consider using H2 tags to structure your content')
      seoScore -= 5
    }
    
    // Image checks
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`)
      seoScore -= Math.min(10, imagesWithoutAlt * 2)
    }
    
    // Link checks
    if (internalLinks < 3) {
      suggestions.push('Add more internal links to improve site navigation')
      seoScore -= 5
    }
    
    // Basic AI score (enhanced)
    let aiScore = 60
    
    // Good for AI if has clear structure
    if (h1s.length === 1) aiScore += 10
    if (h2Count > 2) aiScore += 10
    if (metaDescription && metaDescription.length > 100) aiScore += 10
    if (title && title.length > 30) aiScore += 10
    
    // Calculate overall score
    const overall = Math.round((seoScore + aiScore) / 2)
    
    return {
      url,
      title,
      metaDescription,
      h1: h1s,
      h2Count,
      imageStats: {
        total: images.length,
        withoutAlt: imagesWithoutAlt
      },
      linkStats: {
        internal: internalLinks,
        external: externalLinks
      },
      scores: {
        seo: Math.max(0, seoScore),
        ai: Math.min(100, aiScore),
        overall
      },
      issues,
      suggestions
    }
  } catch (error) {
    throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}