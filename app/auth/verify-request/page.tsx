import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        
        <p className="text-gray-600 mb-6">
          A sign in link has been sent to your email address.
        </p>
        
        <div className="space-y-3 text-sm text-gray-500">
          <p>
            The link will expire in 24 hours for security reasons.
          </p>
          <p>
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <Link 
          href="/" 
          className="mt-8 inline-block text-blue-600 hover:underline"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  )
}