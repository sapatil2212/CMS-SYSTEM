const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSectorsDirectly() {
  try {
    console.log('🧪 Testing Sectors Data Directly...');
    
    // Test 1: Check sectors table
    console.log('\n📋 Testing sectors table...');
    const sectors = await prisma.sector.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    console.log(`✅ Sectors found: ${sectors.length}`);
    sectors.forEach((sector, index) => {
      console.log(`   ${index + 1}. ${sector.name} (ID: ${sector.id})`);
    });
    
    // Test 2: Check sectors overview content
    console.log('\n📝 Testing sectors overview content...');
    const overviewContent = await prisma.sectorsOverviewContent.findFirst({
      where: {
        isActive: true
      }
    });
    
    if (overviewContent) {
      console.log(`✅ Overview content found:`);
      console.log(`   - Title: ${overviewContent.title}`);
      console.log(`   - ID: ${overviewContent.id}`);
      console.log(`   - Has description: ${!!overviewContent.description}`);
    } else {
      console.log('❌ No overview content found');
    }
    
    // Test 3: Check database connection
    console.log('\n🔗 Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    // Test 4: Check if tables exist
    console.log('\n🗄️ Testing table existence...');
    try {
      const sectorCount = await prisma.sector.count();
      console.log(`✅ Sector table exists, count: ${sectorCount}`);
    } catch (error) {
      console.log('❌ Sector table error:', error.message);
    }
    
    try {
      const overviewCount = await prisma.sectorsOverviewContent.count();
      console.log(`✅ SectorsOverviewContent table exists, count: ${overviewCount}`);
    } catch (error) {
      console.log('❌ SectorsOverviewContent table error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSectorsDirectly(); 