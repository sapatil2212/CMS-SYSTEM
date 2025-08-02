const fs = require('fs');
const path = require('path');

// Models that need isMenuActive field added
const modelsToUpdate = [
  'ZincFlakeCoatingContent',
  'MolykoteContent',
  'ZincPlatingContent',
  'NickelPlatingContent',
  'ElectrolessNickelPlatingContent',
  'BrightTinPlatingContent',
  'DullTinPlatingContent',
  'CopperContent',
  'BrassContent',
  'StainlessSteelContent',
  'CarbonSteelContent'
];

function updateSchema() {
  try {
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Updating Prisma schema to add isMenuActive field...');
    
    for (const modelName of modelsToUpdate) {
      // Find the model definition
      const modelRegex = new RegExp(`model ${modelName} \\{[\\s\\S]*?\\}`, 'g');
      const modelMatch = schemaContent.match(modelRegex);
      
      if (modelMatch) {
        const modelContent = modelMatch[0];
        
        // Check if isMenuActive already exists
        if (!modelContent.includes('isMenuActive')) {
          // Add isMenuActive field before createdAt
          const updatedModelContent = modelContent.replace(
            /(\s+ctaDescription\s+String\s+@db\.Text\s*)(\s+createdAt\s+DateTime)/,
            '$1\n  isMenuActive Boolean  @default(true)$2'
          );
          
          // Replace the model in the schema
          schemaContent = schemaContent.replace(modelContent, updatedModelContent);
          console.log(`✅ Added isMenuActive to ${modelName}`);
        } else {
          console.log(`ℹ️ ${modelName} already has isMenuActive field`);
        }
      } else {
        console.log(`⚠️ Could not find model ${modelName}`);
      }
    }
    
    // Write the updated schema
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('✅ Schema updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
  }
}

updateSchema(); 