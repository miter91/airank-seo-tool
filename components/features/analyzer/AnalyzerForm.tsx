'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UpgradePrompt } from '@/components/features/billing/UpgradePrompt';

interface AnalyzerFormProps {
  onAnalysisComplete: (result: any) => void;
  prefillUrl?: string;
}

export function AnalyzerForm({ onAnalysisComplete, prefillUrl = '' }: AnalyzerFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    remaining: number | string;
    limit: number | string;
  } | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Set prefill URL when component mounts or prefillUrl changes
  useEffect(() => {
    if (prefillUrl) {
      setUrl(prefillUrl);
    }
  }, [prefillUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowUpgrade(false);

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit hit - show upgrade prompt for free users
          if (!isAuthenticated) {
            setShowUpgrade(true);
            setError(''); // Clear error since we're showing upgrade prompt
          } else {
            setError(data.error || 'Rate limit exceeded');
          }
          
          // Update usage info from error response
          if (data.remaining !== undefined) {
            setUsageInfo({
              remaining: data.remaining,
              limit: data.limit
            });
          }
        } else {
          throw new Error(data.error || 'Analysis failed');
        }
        return;
      }

      // Update usage info from successful response
      if (data.rateLimit) {
        setUsageInfo({
          remaining: data.rateLimit.remaining,
          limit: data.rateLimit.limit
        });
      }

      onAnalysisComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // If showing upgrade prompt, render it instead of the form
  if (showUpgrade) {
    return (
      <div className="space-y-6">
        <UpgradePrompt 
          message="You've used all 3 free analyses today! Upgrade to Pro for unlimited analyses and advanced features."
          onUpgrade={() => setShowUpgrade(false)}
        />
        <div className="text-center">
          <button
            onClick={() => setShowUpgrade(false)}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to analyzer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analyze Your Website</h2>
          <p className="text-gray-600">
            Get instant SEO and AI optimization scores
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-500">
          {isAuthenticated ? (
            <div>
              <p>Welcome back, {user?.email}!</p>
              <p className="text-green-600 font-semibold">✨ Unlimited analyses available</p>
            </div>
          ) : (
            <div>
              <p>
                Free users: 3 analyses per day •
                <a href="/auth/signin" className="text-blue-600 hover:underline ml-1">
                  Sign in for unlimited
                </a>
              </p>
              {usageInfo && typeof usageInfo.remaining === 'number' && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Usage today:</span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            i < (3 - usageInfo.remaining)
                              ? 'bg-gray-300 text-gray-500'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm">
                      ({usageInfo.remaining} {usageInfo.remaining === 1 ? 'analysis' : 'analyses'} left)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}