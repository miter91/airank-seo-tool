'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnalyzerForm } from '@/components/features/analyzer/AnalyzerForm';
import { ResultsDisplay } from '@/components/features/analyzer/ResultsDisplay';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyzePage() {
  const [result, setResult] = useState<any>(null);
  const [prefillUrl, setPrefillUrl] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get URL parameter for pre-filling
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setPrefillUrl(urlParam);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          SEO & AI Optimization Analyzer
        </h1>
        <p className="text-xl text-gray-600">
          Get instant insights on how to rank in both Google and AI search results
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <AnalyzerForm 
              onAnalysisComplete={setResult} 
              prefillUrl={prefillUrl}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4">
              <button
                onClick={() => setResult(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Analyze another website
              </button>
            </div>
            <ResultsDisplay result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}