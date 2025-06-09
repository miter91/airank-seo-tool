'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or expired.'
      default:
        return 'An error occurred during authentication. Please try again.'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/auth/signin" 
            className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try signing in again
          </Link>
          
          <Link 
            href="/" 
            className="block text-gray-600 hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}