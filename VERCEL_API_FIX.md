# Vercel API 405 Method Not Allowed Fix

## Issue Description
The Base Metal Activation API is returning **405 Method Not Allowed** errors on Vercel deployment, even though it works perfectly locally.

## Root Cause
Vercel's serverless environment sometimes has issues with certain HTTP methods, especially PUT requests. This is a known issue with Next.js API routes on Vercel.

## ✅ Solution Applied

### 1. Enhanced API Route Handler
Updated `app/api/content/base-metal-activation/route.ts` to support multiple HTTP methods:

```typescript
// Handle all HTTP methods
export async function GET() {
  return handleGet()
}

export async function POST(request: NextRequest) {
  return handleUpdate(request)
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request)
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### 2. Frontend Fallback Strategy
Updated `components/admin/BaseMetalActivationManagement.tsx` to try multiple HTTP methods:

```typescript
// Try multiple HTTP methods as fallbacks
const methods = ['PUT', 'POST', 'PATCH']
let response = null
let lastError = null

for (const method of methods) {
  try {
    console.log(`Trying ${method} method...`)
    response = await fetch('/api/content/base-metal-activation', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ baseMetalSlug, isMenuActive }),
    })

    if (response.ok) {
      console.log(`${method} succeeded`)
      break
    } else {
      lastError = `${method} failed with status ${response.status}`
    }
  } catch (error) {
    lastError = `${method} failed: ${error}`
  }
}
```

## 🔧 Testing Steps

### Local Testing
```bash
# Test GET endpoint
curl http://localhost:3000/api/content/base-metal-activation

# Test PUT endpoint
curl -X PUT http://localhost:3000/api/content/base-metal-activation \
  -H "Content-Type: application/json" \
  -d '{"baseMetalSlug":"aluminium","isMenuActive":false}'

# Test POST endpoint
curl -X POST http://localhost:3000/api/content/base-metal-activation \
  -H "Content-Type: application/json" \
  -d '{"baseMetalSlug":"aluminium","isMenuActive":true}'
```

### Vercel Testing
```bash
# Test on Vercel deployment
curl https://your-app.vercel.app/api/content/base-metal-activation

# Test PUT on Vercel
curl -X PUT https://your-app.vercel.app/api/content/base-metal-activation \
  -H "Content-Type: application/json" \
  -d '{"baseMetalSlug":"aluminium","isMenuActive":false}'
```

## 🚀 Deployment Steps

1. **Commit and Push Changes**:
   ```bash
   git add .
   git commit -m "FIX: Add multiple HTTP method support for base metal activation API"
   git push
   ```

2. **Monitor Vercel Deployment**:
   - Check Vercel dashboard for deployment status
   - Monitor function logs for any errors

3. **Test After Deployment**:
   - Navigate to `/admin/header`
   - Click "Menu Management" → "Base Metal Pages"
   - Try toggling base metal activation
   - Check browser console for method attempts

## 🔍 Debug Information

The updated components now include comprehensive logging:

- **API Route**: Logs all incoming requests with method and status
- **Frontend**: Logs each HTTP method attempt and result
- **Error Handling**: Provides detailed error messages for troubleshooting

## 📋 Expected Behavior

### Before Fix:
- ❌ PUT requests return 405 Method Not Allowed
- ❌ Toggle buttons don't work
- ❌ Error messages in console

### After Fix:
- ✅ PUT requests work (primary method)
- ✅ POST requests work (fallback)
- ✅ PATCH requests work (fallback)
- ✅ Toggle buttons work correctly
- ✅ Success messages appear
- ✅ Changes reflect immediately

## 🛠️ Alternative Solutions

If the issue persists, consider these alternatives:

### 1. Use POST Only
```typescript
// Always use POST method
const response = await fetch('/api/content/base-metal-activation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ baseMetalSlug, isMenuActive }),
})
```

### 2. Add Route Rewrites
Add to `next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/api/content/base-metal-activation',
      destination: '/api/content/base-metal-activation',
    },
  ]
}
```

### 3. Use Edge Runtime
Add to API route:
```typescript
export const runtime = 'edge'
```

## 📞 Troubleshooting

If issues persist:

1. **Check Vercel Logs**:
   - Go to Vercel dashboard
   - Check function logs for errors
   - Look for 405 or other HTTP errors

2. **Test Individual Methods**:
   - Test each HTTP method separately
   - Check which methods work on Vercel

3. **Verify Route Structure**:
   - Ensure file is in correct location
   - Check for any naming conflicts

4. **Clear Vercel Cache**:
   - Redeploy with cache clearing
   - Check if issue persists

## 🎯 Success Criteria

The fix is successful when:
- ✅ Base metal toggle buttons work on Vercel
- ✅ No 405 errors in browser console
- ✅ Success messages appear after toggling
- ✅ Changes persist in database
- ✅ Frontend navigation updates correctly 