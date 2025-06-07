export interface AnalysisResult {
    url: string
    timestamp: Date
    scores: {
      seo: number
      ai: number
      overall: number
    }
    technical: {
      score: number
      issues: string[]
      suggestions: string[]
    }
    onPage: {
      score: number
      issues: string[]
      suggestions: string[]
    }
    aiOptimization: {
      score: number
      readability: number
      citationPotential: number
      issues: string[]
      suggestions: string[]
    }
    topRecommendations: string[]
  }