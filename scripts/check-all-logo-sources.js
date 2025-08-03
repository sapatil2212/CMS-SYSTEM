const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllLogoSources() {
  try {
    console.log('🔍 Comprehensive check of all logo sources...\n');
    
    // 1. Check HeaderSettings table
    console.log('1️⃣  Checking HeaderSettings table:');
    const headerSettings = await prisma.headerSettings.findMany();
    console.log(`   Found ${headerSettings.length} header setting(s)`);
    
    for (const setting of headerSettings) {
      console.log(`   - ID: ${setting.id}`);
      console.log(`     Logo URL: ${setting.logoUrl}`);
      console.log(`     Logo Alt: "${setting.logoAlt}"`);
      console.log(`     Phone: ${setting.phoneNumber}`);
      console.log(`     Email: ${setting.email}`);
      
      if (setting.logoAlt && setting.logoAlt.includes('CMS')) {
        console.log(`   ⚠️  WARNING: Found "CMS" in logoAlt!`);
      }
    }
    
    // 2. Check FooterSettings table
    console.log('\n2️⃣  Checking FooterSettings table:');
    const footerSettings = await prisma.footerSettings.findMany();
    console.log(`   Found ${footerSettings.length} footer setting(s)`);
    
    for (const setting of footerSettings) {
      console.log(`   - ID: ${setting.id}`);
      console.log(`     Logo URL: ${setting.logoUrl}`);
      console.log(`     Logo Alt: "${setting.logoAlt}"`);
      
      if (setting.logoAlt && setting.logoAlt.includes('CMS')) {
        console.log(`   ⚠️  WARNING: Found "CMS" in logoAlt!`);
      }
    }
    
    // 3. Check if there are any other tables with logo fields
    console.log('\n3️⃣  Checking for other tables with logo fields:');
    
    // Get all table names
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('   Available tables:');
    for (const table of tables) {
      console.log(`   - ${table.table_name}`);
    }
    
    // 4. Check for any cached data or environment variables
    console.log('\n4️⃣  Environment and cache check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
    
    // 5. Summary
    console.log('\n🎉 Summary:');
    console.log(`   Header settings checked: ${headerSettings.length}`);
    console.log(`   Footer settings checked: ${footerSettings.length}`);
    console.log(`   Total tables found: ${tables.length}`);
    
    let issuesFound = 0;
    
    // Check for any CMS references
    for (const setting of headerSettings) {
      if (setting.logoAlt && setting.logoAlt.includes('CMS')) {
        issuesFound++;
      }
    }
    
    for (const setting of footerSettings) {
      if (setting.logoAlt && setting.logoAlt.includes('CMS')) {
        issuesFound++;
      }
    }
    
    if (issuesFound > 0) {
      console.log(`   ⚠️  Issues found: ${issuesFound} settings contain "CMS" text`);
    } else {
      console.log(`   ✅ No issues found - database is clean`);
    }
    
    console.log('\n💡 If you\'re still seeing CMS text, try:');
    console.log('   1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   2. Restart the development server');
    console.log('   3. Check browser developer tools for cached responses');
    
  } catch (error) {
    console.error('❌ Error during comprehensive check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the comprehensive check
checkAllLogoSources(); 