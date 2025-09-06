import { prisma } from './db';
import { logger } from './logger';

export interface DatabaseConnectionTest {
  isConnected: boolean;
  error?: string;
  responseTime?: number;
  databaseInfo?: {
    version?: string;
    connectionId?: string;
  };
}

export async function testDatabaseConnection(): Promise<DatabaseConnectionTest> {
  const startTime = Date.now();
  
  try {
    // Test basic connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test, CONNECTION_ID() as connection_id, VERSION() as version`;
    
    const responseTime = Date.now() - startTime;
    
    logger.log(`Database connection test successful. Response time: ${responseTime}ms`);
    
    return {
      isConnected: true,
      responseTime,
      databaseInfo: {
        version: (result as any)[0]?.version,
        connectionId: (result as any)[0]?.connection_id?.toString(),
      },
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    logger.log(`Database connection test failed: ${error.message}`);
    
    return {
      isConnected: false,
      error: error.message,
      responseTime,
    };
  }
}

export async function testDatabaseTables(): Promise<{ tableCount: number; error?: string }> {
  try {
    // Test if we can access the database tables
    const tables = await prisma.$queryRaw`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `;
    
    const tableCount = (tables as any)[0]?.table_count || 0;
    
    logger.log(`Database tables accessible. Table count: ${tableCount}`);
    
    return { tableCount };
  } catch (error: any) {
    logger.log(`Database tables test failed: ${error.message}`);
    return { tableCount: 0, error: error.message };
  }
}

export async function performFullDatabaseHealthCheck(): Promise<{
  connection: DatabaseConnectionTest;
  tables: { tableCount: number; error?: string };
  overall: boolean;
}> {
  logger.log('Starting full database health check...');
  
  const connection = await testDatabaseConnection();
  const tables = await testDatabaseTables();
  
  const overall = connection.isConnected && !tables.error;
  
  logger.log(`Database health check completed. Overall status: ${overall ? 'HEALTHY' : 'UNHEALTHY'}`);
  
  return {
    connection,
    tables,
    overall,
  };
}
