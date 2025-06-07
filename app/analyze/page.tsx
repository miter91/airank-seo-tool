export default function AnalyzePage() {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">SEO & AI Analyzer</h1>
        <p className="text-gray-600 mb-8">
          Analyze your website for both traditional SEO and AI optimization
        </p>
        
        <div className="max-w-2xl">
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full p-3 border rounded-lg"
          />
          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Analyze Website
          </button>
        </div>
      </div>
    )
  }