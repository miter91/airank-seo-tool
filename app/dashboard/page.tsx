'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Analysis {
  id: string;
  url: string;
  seoScore: number;
  aiScore: number;
  overallScore: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyses();
    }
  }, [isAuthenticated]);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/v1/user/analyses');
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Analyses</h3>
          <p className="text-3xl font-bold text-blue-600">{analyses.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Average SEO Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {analyses.length > 0 
              ? Math.round(analyses.reduce((acc, a) => acc + a.seoScore, 0) / analyses.length)
              : '-'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Average AI Score</h3>
          <p className="text-3xl font-bold text-purple-600">
            {analyses.length > 0 
              ? Math.round(analyses.reduce((acc, a) => acc + a.aiScore, 0) / analyses.length)
              : '-'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Analysis History</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading analyses...
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">No analyses yet</p>
            <Link href="/analyze">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Start Your First Analysis
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SEO Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={analysis.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {new URL(analysis.url).hostname}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        analysis.seoScore >= 80 ? 'text-green-600' : 
                        analysis.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {analysis.seoScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        analysis.aiScore >= 80 ? 'text-green-600' : 
                        analysis.aiScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {analysis.aiScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold">
                        {analysis.overallScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/analyze?url=${encodeURIComponent(analysis.url)}`}
                        className="text-blue-600 hover:underline"
                      >
                        Re-analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}