import { NextRequest, NextResponse } from 'next/server';
import { performFullDatabaseHealthCheck } from '@/lib/database-connection-test';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.log('Database health check requested');
    
    const healthCheck = await performFullDatabaseHealthCheck();
    
    const response = {
      timestamp: new Date().toISOString(),
      status: healthCheck.overall ? 'healthy' : 'unhealthy',
      details: healthCheck,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      },
    };
    
    return NextResponse.json(response, {
      status: healthCheck.overall ? 200 : 503,
    });
  } catch (error: any) {
    logger.log(`Database health check error: ${error.message}`);
    
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        },
      },
      { status: 500 }
    );
  }
}
