const fs = require('fs');
const path = require('path');

function fixSchema() {
  try {
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Fixing Prisma schema formatting...');
    
    // Fix the malformed lines by adding proper newlines
    schemaContent = schemaContent.replace(
      /(\s+ctaDescription\s+String\s+@db\.Text\s*)(\s+isMenuActive\s+Boolean\s+@default\(true\)\s+createdAt\s+DateTime)/g,
      '$1\n  isMenuActive Boolean  @default(true)\n  createdAt DateTime'
    );
    
    // Write the fixed schema
    fs.writeFileSync(schemaPath, schemaContent);
    console.log('✅ Schema formatting fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  }
}

fixSchema(); 