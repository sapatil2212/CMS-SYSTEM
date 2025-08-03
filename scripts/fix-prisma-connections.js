const fs = require('fs');
const path = require('path');

// List of API routes that need to be fixed
const apiRoutesToFix = [
  'app/api/visitors/test/route.ts',
  'app/api/visitors/reset/route.ts',
  'app/api/auth/profile-otp/route.ts',
  'app/api/auth/signup-otp/route.ts',
  'app/api/auth/forgot-password/route.ts',
  'app/api/admin/users/otp/route.ts',
  'app/api/admin/stats/base-metals-count/route.ts',
  'app/api/admin/stats/processes-count/route.ts',
  'app/api/admin/content/contact/route.ts',
];

function fixPrismaConnection(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already uses shared prisma instance
    if (content.includes("import { prisma } from '@/lib/db'")) {
      console.log(`✅ Already fixed: ${filePath}`);
      return true;
    }

    // Replace new PrismaClient() with shared instance
    const oldImport = /import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@prisma\/client['"];?\s*\nconst\s+prisma\s*=\s*new\s+PrismaClient\(\)/;
    const newImport = "import { prisma } from '@/lib/db'";
    
    if (oldImport.test(content)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Fixing Prisma connections in API routes...\n');

let fixedCount = 0;
let totalCount = 0;

for (const route of apiRoutesToFix) {
  totalCount++;
  if (fixPrismaConnection(route)) {
    fixedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`✅ Fixed: ${fixedCount} files`);
console.log(`📁 Total: ${totalCount} files`);
console.log(`\n🎉 Database connection optimization complete!`); 