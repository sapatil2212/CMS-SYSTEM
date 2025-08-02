const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMenuActiveFields() {
  try {
    console.log('🌱 Adding isMenuActive fields to process and base metal content models...');
    
    // List of all process content models that need the isMenuActive field
    const processModels = [
      'RackBarrelPlatingContent',
      'ZincFlakeCoatingContent',
      'MolykoteContent',
      'ZincPlatingContent',
      'NickelPlatingContent',
      'ElectrolessNickelPlatingContent',
      'BrightTinPlatingContent',
      'DullTinPlatingContent'
    ];
    
    // List of all base metal content models that need the isMenuActive field
    const baseMetalModels = [
      'AluminiumContent',
      'SteelContent',
      'CopperContent',
      'BrassContent',
      'StainlessSteelContent',
      'CarbonSteelContent'
    ];
    
    // Add isMenuActive field to process models
    for (const modelName of processModels) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${modelName} ADD COLUMN isMenuActive BOOLEAN DEFAULT TRUE`);
        console.log(`✅ Added isMenuActive field to ${modelName}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ isMenuActive field already exists in ${modelName}`);
        } else {
          console.error(`❌ Error adding isMenuActive to ${modelName}:`, error.message);
        }
      }
    }
    
    // Add isMenuActive field to base metal models
    for (const modelName of baseMetalModels) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${modelName} ADD COLUMN isMenuActive BOOLEAN DEFAULT TRUE`);
        console.log(`✅ Added isMenuActive field to ${modelName}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ isMenuActive field already exists in ${modelName}`);
        } else {
          console.error(`❌ Error adding isMenuActive to ${modelName}:`, error.message);
        }
      }
    }
    
    console.log('✅ Successfully added isMenuActive fields to all models!');
    
  } catch (error) {
    console.error('❌ Error adding isMenuActive fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMenuActiveFields(); 