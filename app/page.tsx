import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Brain, Shield, TrendingUp, Star, Menu } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl">AIRank Pro</div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="hover:text-blue-600">Features</Link>
              <Link href="#pricing" className="hover:text-blue-600">Pricing</Link>
              <Link href="#how-it-works" className="hover:text-blue-600">How it Works</Link>
              <Link href="/analyze" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Try Free
              </Link>
            </div>
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              SEO Analysis for the <span className="text-blue-600">AI Era</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The first SEO tool that analyzes your website for both traditional search engines 
              and AI-powered search like ChatGPT. Get actionable insights in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                Analyze Your Site Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 flex items-center justify-center">
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 3 free analyses per day
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">SEO Factors Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10s</div>
              <div className="text-gray-600">Analysis Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">2-in-1</div>
              <div className="text-gray-600">SEO + AI Scoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Actionable Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Rank Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive analysis for modern search optimization
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
              title="Traditional SEO Analysis"
              description="Check title tags, meta descriptions, headings, image optimization, and more with detailed recommendations"
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-600" />}
              title="AI Search Optimization"
              description="Understand how AI systems like ChatGPT will interpret and cite your content"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-yellow-600" />}
              title="Instant Results"
              description="Get comprehensive analysis in seconds, not hours. No complex setup required"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-600" />}
              title="Actionable Insights"
              description="Clear, prioritized recommendations you can implement immediately"
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-red-600" />}
              title="Track Progress"
              description="Monitor your improvements over time and see what's working"
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-indigo-600" />}
              title="Share Reports"
              description="Generate beautiful reports to share with clients or team members"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to better rankings
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <StepCard
                number="1"
                title="Enter Your URL"
                description="Just paste your website URL - no complex setup or installation needed"
              />
              <StepCard
                number="2"
                title="Get Instant Analysis"
                description="Our AI analyzes 50+ factors for both traditional SEO and AI optimization"
              />
              <StepCard
                number="3"
                title="Implement & Improve"
                description="Follow our prioritized recommendations to boost your visibility"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              features={[
                "3 analyses per day",
                "Basic SEO scoring",
                "AI optimization score",
                "Core recommendations"
              ]}
              cta="Start Free"
              href="/analyze"
            />
            <PricingCard
              title="Pro"
              price="$29"
              features={[
                "Unlimited analyses",
                "Advanced AI insights",
                "Competitor comparison",
                "Priority support",
                "Bulk URL analysis",
                "White-label reports"
              ]}
              cta="Coming Soon"
              href="#"
              featured
            />
            <PricingCard
              title="Agency"
              price="$99"
              features={[
                "Everything in Pro",
                "API access",
                "Custom branding",
                "Team accounts",
                "Advanced analytics",
                "Dedicated support"
              ]}
              cta="Coming Soon"
              href="#"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize for AI-Powered Search?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join forward-thinking marketers preparing for the future of SEO
          </p>
          <Link href="/analyze" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-flex items-center gap-2">
            Analyze Your Site Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="font-bold text-xl mb-4">AIRank Pro</div>
            <p className="text-sm">
              © 2024 AIRank Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

// Component helpers
function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function PricingCard({ title, price, features, cta, href, featured }: any) {
  return (
    <div className={`bg-white p-8 rounded-lg ${featured ? 'shadow-xl border-2 border-blue-600' : 'shadow-md'}`}>
      {featured && (
        <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-6">
        {price}<span className="text-lg font-normal text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className={`block text-center py-3 rounded-lg font-semibold ${
        featured 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        {cta}
      </Link>
    </div>
  )
}