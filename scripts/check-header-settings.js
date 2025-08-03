const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndUpdateHeaderSettings() {
  try {
    console.log('🔍 Checking header settings in database...');
    
    // Get all header settings
    const headerSettings = await prisma.headerSettings.findMany();
    
    if (headerSettings.length === 0) {
      console.log('📝 No header settings found in database');
      return;
    }
    
    console.log(`📊 Found ${headerSettings.length} header setting(s):`);
    
    let updatedCount = 0;
    
    for (const setting of headerSettings) {
      console.log(`\n📋 Header Setting ID: ${setting.id}`);
      console.log(`   Logo URL: ${setting.logoUrl}`);
      console.log(`   Logo Alt: ${setting.logoAlt}`);
      console.log(`   Phone: ${setting.phoneNumber}`);
      console.log(`   Email: ${setting.email}`);
      
      // Check if logoAlt contains "CMS System Logo"
      if (setting.logoAlt && setting.logoAlt.includes('CMS System Logo')) {
        console.log(`⚠️  Found "CMS System Logo" in logoAlt - updating to "company_logo"`);
        
        await prisma.headerSettings.update({
          where: { id: setting.id },
          data: { logoAlt: 'company_logo' }
        });
        
        console.log(`✅ Updated header setting ${setting.id}`);
        updatedCount++;
      } else if (setting.logoAlt && setting.logoAlt.includes('CMS')) {
        console.log(`⚠️  Found "CMS" in logoAlt - updating to "company_logo"`);
        
        await prisma.headerSettings.update({
          where: { id: setting.id },
          data: { logoAlt: 'company_logo' }
        });
        
        console.log(`✅ Updated header setting ${setting.id}`);
        updatedCount++;
      } else {
        console.log(`✅ Logo alt text is already correct: "${setting.logoAlt}"`);
      }
    }
    
    console.log(`\n🎉 Summary:`);
    console.log(`   Total settings checked: ${headerSettings.length}`);
    console.log(`   Settings updated: ${updatedCount}`);
    
    if (updatedCount > 0) {
      console.log(`\n✅ Database has been updated! The CMS text should no longer appear.`);
    } else {
      console.log(`\n✅ No updates needed - database is already correct.`);
    }
    
  } catch (error) {
    console.error('❌ Error checking/updating header settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkAndUpdateHeaderSettings(); 