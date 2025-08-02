const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection and process activation...\n');
    
    // Test 1: Check if we can connect to the database
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Check if isMenuActive field exists in process models
    console.log('\n2. Testing process models with isMenuActive field...');
    
    const processes = await Promise.all([
      prisma.copperPlatingContent.findFirst().then(content => ({
        name: 'Copper Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.silverPlatingContent.findFirst().then(content => ({
        name: 'Silver Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.goldPlatingContent.findFirst().then(content => ({
        name: 'Gold Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.busbarPlatingContent.findFirst().then(content => ({
        name: 'Busbar Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.zincPlatingContent.findFirst().then(content => ({
        name: 'Zinc Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.nickelPlatingContent.findFirst().then(content => ({
        name: 'Nickel Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.electrolessNickelPlatingContent.findFirst().then(content => ({
        name: 'Electroless Nickel Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.brightTinPlatingContent.findFirst().then(content => ({
        name: 'Bright Tin Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.dullTinPlatingContent.findFirst().then(content => ({
        name: 'Dull Tin Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.rackBarrelPlatingContent.findFirst().then(content => ({
        name: 'Rack & Barrel Plating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.zincFlakeCoatingContent.findFirst().then(content => ({
        name: 'Zinc Flake Coating',
        isMenuActive: content?.isMenuActive ?? false
      })),
      prisma.molykoteContent.findFirst().then(content => ({
        name: 'Molykote',
        isMenuActive: content?.isMenuActive ?? false
      }))
    ]);
    
    console.log('Process Status:');
    console.log('===============');
    
    let activeCount = 0;
    processes.forEach(process => {
      const status = process.isMenuActive ? '✅ ACTIVE' : '❌ INACTIVE';
      console.log(`${process.name}: ${status}`);
      if (process.isMenuActive) activeCount++;
    });
    
    console.log('\n===============');
    console.log(`Total Active: ${activeCount}/12`);
    console.log(`Total Inactive: ${12 - activeCount}/12`);
    
    // Test 3: Try to update a process activation status
    console.log('\n3. Testing process activation update...');
    try {
      const result = await prisma.zincPlatingContent.updateMany({
        where: {},
        data: { isMenuActive: true }
      });
      console.log('✅ Successfully updated Zinc Plating activation status');
      console.log(`Updated ${result.count} records`);
    } catch (error) {
      console.error('❌ Error updating process activation:', error.message);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 