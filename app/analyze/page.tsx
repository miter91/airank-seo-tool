'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react'

interface AnalysisResult {
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

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to analyze website. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎉'
    if (score >= 60) return '👍'
    return '😟'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SEO & AI Analyzer</h1>
          <p className="text-gray-600">
            Get instant insights on how to improve your website for both traditional search engines and AI-powered search
          </p>
        </div>
        
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://example.com"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Website'
              )}
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Analyzing your website...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">SEO Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(result.scores.seo)}`}>
                  {result.scores.seo}
                </div>
                <div className="text-2xl mt-2">{getScoreEmoji(result.scores.seo)}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">AI Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(result.scores.ai)}`}>
                  {result.scores.ai}
                </div>
                <div className="text-2xl mt-2">{getScoreEmoji(result.scores.ai)}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform border-2 border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Overall Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(result.scores.overall)}`}>
                  {result.scores.overall}
                </div>
                <div className="text-2xl mt-2">{getScoreEmoji(result.scores.overall)}</div>
              </div>
            </div>

            {/* Analyzed URL */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">Analyzed:</span>
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                {result.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Page Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-600" />
                Page Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Title:</span>
                    <p className="text-gray-600">{result.title || 'Not found'}</p>
                    <p className="text-sm text-gray-500">({result.title?.length || 0} characters)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Meta Description:</span>
                    <p className="text-gray-600">{result.metaDescription || 'Not found'}</p>
                    <p className="text-sm text-gray-500">({result.metaDescription?.length || 0} characters)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">H1 Tags:</span>
                    <p className="text-gray-600">{result.h1.length > 0 ? result.h1.join(', ') : 'None found'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">H2 Tags:</span>
                    <span className="text-gray-600">{result.h2Count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Total Images:</span>
                    <span className="text-gray-600">{result.imageStats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Images Missing Alt:</span>
                    <span className="text-gray-600">{result.imageStats?.withoutAlt || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Internal Links:</span>
                    <span className="text-gray-600">{result.linkStats?.internal || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">External Links:</span>
                    <span className="text-gray-600">{result.linkStats?.external || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-red-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Issues Found ({result.issues.length})
                </h3>
                <ul className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-red-600">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-yellow-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Suggestions ({result.suggestions.length})
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="text-yellow-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}