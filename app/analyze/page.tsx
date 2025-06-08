'use client'

import { useState } from 'react'

interface AnalysisResult {
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
      const response = await fetch('/api/v1/analyze', {  // <- This is the line I was referring to
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
      setError('Failed to analyze website. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">SEO & AI Analyzer</h1>
      <p className="text-gray-600 mb-8">
        Analyze your website for both traditional SEO and AI optimization
      </p>
      
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-3 border rounded-lg"
            disabled={loading}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">SEO Score</h3>
              <div className="text-4xl font-bold text-blue-600">{result.scores.seo}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">AI Score</h3>
              <div className="text-4xl font-bold text-purple-600">{result.scores.ai}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
              <div className="text-4xl font-bold text-green-600">{result.scores.overall}</div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Page Details</h3>
            <div className="space-y-2">
              <p><strong>Title:</strong> {result.title || 'Not found'}</p>
              <p><strong>Meta Description:</strong> {result.metaDescription || 'Not found'}</p>
              <p><strong>H1 Tags:</strong> {result.h1.length > 0 ? result.h1.join(', ') : 'None found'}</p>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-700">Issues Found</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-red-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-yellow-700">Suggestions</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-yellow-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}