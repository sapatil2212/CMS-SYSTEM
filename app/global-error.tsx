'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-red-300">500</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mt-4">Something went wrong!</h2>
              <p className="text-gray-600 mt-2">
                We're experiencing some technical difficulties.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-2"
              >
                Try again
              </button>
              
              <Link 
                href="/"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </Link>
              
              <div className="text-sm text-gray-500 mt-4">
                <p>If the problem persists, please contact support.</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 