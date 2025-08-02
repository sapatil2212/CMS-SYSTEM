const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkActiveProcesses() {
  try {
    console.log('Checking active processes...\n');
    
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
    
  } catch (error) {
    console.error('Error checking processes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActiveProcesses(); 