'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AnalyzerFormProps {
  onAnalysisComplete: (result: any) => void;
}

export function AnalyzerForm({ onAnalysisComplete }: AnalyzerFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
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
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }
      
      const result = await response.json();
      
      // ADD THIS DEBUG LINE
      // console.log('API Response:', result);
      
      onAnalysisComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };
  
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
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <div className="text-sm text-gray-500">
          {isAuthenticated ? (
            <p>Welcome back, {user?.email}! You have unlimited analyses.</p>
          ) : (
            <p>
              Free users: 3 analyses per day • 
              <a href="/auth/signin" className="text-blue-600 hover:underline ml-1">
                Sign in for unlimited
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}