const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
    __internal: {
      engine: {
        connectionLimit: 1,
      },
    },
  });

  try {
    // Test basic connection
    console.log('Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    console.log('Testing simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);

    // Test connection pool
    console.log('Testing connection pool...');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(prisma.$queryRaw`SELECT ${i} as test_number`);
    }
    
    const results = await Promise.all(promises);
    console.log('✅ Connection pool test successful:', results.length, 'queries executed');

    console.log('🎉 All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

testDatabaseConnection(); 