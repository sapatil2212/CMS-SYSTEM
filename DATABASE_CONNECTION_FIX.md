# Database Connection Fix for TiDB Cloud

## Problem Identified
Your CMS system is experiencing database connection issues with TiDB Cloud. The main problems are:

1. **Malformed DATABASE_URL**: The connection string has line breaks and formatting issues
2. **Missing connection parameters**: TiDB Cloud requires specific SSL and connection parameters
3. **Insufficient connection resilience**: The current setup doesn't handle connection drops properly

## Solution

### Step 1: Fix Your .env File

Replace your current DATABASE_URL in the `.env` file with this corrected version:

```bash
DATABASE_URL="mysql://3qmhCmh9ujF3xSJ.root:qyht9OHze8DvmK3Q@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/cms?sslaccept=strict&sslmode=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
```

**Important Notes:**
- Remove all line breaks from the DATABASE_URL
- The connection string must be on a single line
- Added connection pooling parameters for better stability

### Step 2: Alternative Connection String (if the above doesn't work)

If you continue to have issues, try this alternative format:

```bash
DATABASE_URL="mysql://3qmhCmh9ujF3xSJ.root:qyht9OHze8DvmK3Q@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/cms?sslaccept=strict&sslmode=require&connection_limit=3&pool_timeout=30&connect_timeout=60&socket_timeout=60"
```

### Step 3: Test the Connection

After updating your `.env` file:

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Test the database health**:
   ```bash
   curl http://localhost:3000/api/debug/database-health
   ```

3. **Check the server logs** for any connection errors

### Step 4: Verify TiDB Cloud Settings

Make sure your TiDB Cloud cluster is configured correctly:

1. **Check cluster status** in TiDB Cloud dashboard
2. **Verify connection settings**:
   - Host: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
   - Port: `4000`
   - SSL: Required
   - Database: `cms`

3. **Check user permissions**:
   - Username: `3qmhCmh9ujF3xSJ.root`
   - Ensure the user has proper permissions on the `cms` database

### Step 5: Additional Troubleshooting

If you still have issues:

1. **Check TiDB Cloud connection limits**:
   - Ensure you're not exceeding connection limits
   - Check if there are any IP restrictions

2. **Test with a simple connection**:
   ```bash
   # Install mysql client if not already installed
   mysql -h gateway01.ap-southeast-1.prod.aws.tidbcloud.com -P 4000 -u 3qmhCmh9ujF3xSJ.root -p --ssl-mode=REQUIRED cms
   ```

3. **Check network connectivity**:
   - Ensure your local machine can reach TiDB Cloud
   - Check firewall settings

## What I've Fixed in the Code

1. **Enhanced Prisma Configuration** (`lib/db.ts`):
   - Added connection timeouts
   - Improved error handling with retry logic
   - Better connection pooling configuration

2. **Database Health Check** (`app/api/debug/database-health/route.ts`):
   - Created a health check endpoint to monitor database status
   - Provides detailed connection information

3. **Connection Testing Utilities** (`lib/database-connection-test.ts`):
   - Functions to test database connectivity
   - Performance monitoring
   - Detailed error reporting

## Expected Results

After applying these fixes:

1. ✅ Database connection errors should be resolved
2. ✅ API endpoints should work properly
3. ✅ Base metal activation should function
4. ✅ Gallery content should load
5. ✅ All database operations should be stable

## Monitoring

Use the health check endpoint to monitor your database:
- **URL**: `http://localhost:3000/api/debug/database-health`
- **Expected Response**: Status 200 with connection details
- **Error Response**: Status 503 with error details

## Next Steps

1. Update your `.env` file with the corrected DATABASE_URL
2. Restart your development server
3. Test the health check endpoint
4. Verify that your application is working properly

If you continue to have issues after these steps, please share the output of the health check endpoint and any error messages from the server logs.