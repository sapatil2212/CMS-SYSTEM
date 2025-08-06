export default function TestFixesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Test Page - Fixes Verification
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Font Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Font Test
            </h2>
            <div className="space-y-4">
              <p className="text-lg font-normal">
                This is normal Inter font text
              </p>
              <p className="text-lg font-medium">
                This is medium Inter font text
              </p>
              <p className="text-lg font-semibold">
                This is semibold Inter font text
              </p>
              <p className="text-lg font-bold">
                This is bold Inter font text
              </p>
            </div>
          </div>

          {/* Menu Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Menu Items Test
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Check the header navigation above. You should see:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Home (only once)</li>
                <li>About (only once)</li>
                <li>Processes (only once)</li>
                <li>Base Metals (only once)</li>
                <li>Sectors (only once)</li>
                <li>Quality Testing (only once)</li>
                <li>Contact (only once)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Expected Results:
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>✅ Inter font should be visible and properly loaded</li>
            <li>✅ No duplicate menu items in the header</li>
            <li>✅ All menu items should appear only once</li>
            <li>✅ Font should be crisp and clear</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 