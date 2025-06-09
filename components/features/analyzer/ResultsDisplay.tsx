'use client';

interface ResultsDisplayProps {
  result: any;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) return null;

  // Safely access nested properties with defaults
  const scores = result.scores || {};
  const technical = result.technical || {};
  const onPage = result.onPage || {};
  const aiOptimization = result.aiOptimization || {};
  const topRecommendations = result.topRecommendations || [];

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold mb-2">SEO Score</h3>
          <div className="text-4xl font-bold text-blue-600">{scores.seo || 0}</div>
          <p className="text-gray-600 mt-2">Traditional SEO</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold mb-2">AI Score</h3>
          <div className="text-4xl font-bold text-purple-600">{scores.ai || 0}</div>
          <p className="text-gray-600 mt-2">AI Optimization</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-2 border-blue-600">
          <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
          <div className="text-4xl font-bold text-green-600">{scores.overall || 0}</div>
          <p className="text-gray-600 mt-2">Combined Score</p>
        </div>
      </div>

      {/* Top Recommendations */}
      {topRecommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">🎯 Top Recommendations</h3>
          <ul className="space-y-3">
            {topRecommendations.map((rec: string, index: number) => {
              const priority = rec.includes('Critical') ? '🔴' : 
                             rec.includes('High') ? '🟠' : 
                             rec.includes('Medium') ? '🟡' : '🟢';
              return (
                <li key={index} className="flex items-start">
                  <span className="mr-2">{priority}</span>
                  <span>{rec}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Technical SEO Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">🔧 Technical SEO</h3>
        
        {/* Technical Metrics */}
        {technical.details && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{technical.details.loadTime}s</div>
              <div className="text-sm text-gray-600">Load Time</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{technical.details.pageSize}</div>
              <div className="text-sm text-gray-600">Page Size</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{technical.details.requests}</div>
              <div className="text-sm text-gray-600">Requests</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{technical.details.mobileScore}</div>
              <div className="text-sm text-gray-600">Mobile Score</div>
            </div>
          </div>
        )}
        
        {/* Issues and Suggestions */}
        <div className="grid md:grid-cols-2 gap-6">
          {technical.issues && technical.issues.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Issues Found:</h4>
              <ul className="space-y-1">
                {technical.issues.map((issue: string, i: number) => (
                  <li key={i} className="text-sm flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {technical.suggestions && technical.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Suggestions:</h4>
              <ul className="space-y-1">
                {technical.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* On-Page SEO Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">📝 On-Page SEO</h3>
        
        {/* On-Page Metrics */}
        {onPage.details && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.titleLength}</div>
              <div className="text-sm text-gray-600">Title Length</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.h1Count}</div>
              <div className="text-sm text-gray-600">H1 Tags</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.imagesWithoutAlt}</div>
              <div className="text-sm text-gray-600">Images w/o Alt</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.wordCount}</div>
              <div className="text-sm text-gray-600">Word Count</div>
            </div>
          </div>
        )}
        
        {/* Additional Metrics */}
        {onPage.details && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.internalLinks}</div>
              <div className="text-sm text-gray-600">Internal Links</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.externalLinks}</div>
              <div className="text-sm text-gray-600">External Links</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{onPage.details.h2Count}</div>
              <div className="text-sm text-gray-600">H2 Tags</div>
            </div>
          </div>
        )}
        
        {/* Issues and Suggestions */}
        <div className="grid md:grid-cols-2 gap-6">
          {onPage.issues && onPage.issues.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2">❌ Issues Found:</h4>
              <ul className="space-y-1">
                {onPage.issues.map((issue: string, i: number) => (
                  <li key={i} className="text-sm flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {onPage.suggestions && onPage.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Suggestions:</h4>
              <ul className="space-y-1">
                {onPage.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* AI Optimization */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">🤖 AI Optimization</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold">{aiOptimization.readability || 0}</div>
            <div className="text-sm text-gray-600">Readability</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold">{aiOptimization.structure || 0}</div>
            <div className="text-sm text-gray-600">Structure</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold">{aiOptimization.citationPotential || 0}</div>
            <div className="text-sm text-gray-600">Citation Potential</div>
          </div>
        </div>
        
        {/* AI Issues and Suggestions */}
        {aiOptimization.details && (
          <div className="grid md:grid-cols-2 gap-6">
            {aiOptimization.details.issues && aiOptimization.details.issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2">❌ AI Issues:</h4>
                <ul className="space-y-1">
                  {aiOptimization.details.issues.map((issue: string, i: number) => (
                    <li key={i} className="text-sm flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {aiOptimization.details.suggestions && aiOptimization.details.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ AI Suggestions:</h4>
                <ul className="space-y-1">
                  {aiOptimization.details.suggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="text-sm flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center text-gray-600 mt-8">
        <p className="text-sm">Analyzed: {result.url}</p>
        <p className="text-xs mt-1">Analysis completed at: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}