const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testActivityTracking() {
  try {
    console.log('🧪 Testing Activity Tracking System...\n');
    
    // Test 1: Create a test activity
    console.log('1. Creating test activity...');
    const testActivity = await prisma.userActivity.create({
      data: {
        userId: 'test-user-123',
        userName: 'Test User',
        action: 'activated',
        target: 'process',
        targetName: 'Copper Plating',
        details: 'Test activity for Copper Plating process',
        type: 'process',
        timestamp: new Date()
      }
    });
    console.log('✅ Test activity created:', testActivity.id);
    
    // Test 2: Fetch recent activities
    console.log('\n2. Fetching recent activities...');
    const activities = await prisma.userActivity.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });
    
    console.log(`✅ Found ${activities.length} activities in the last 24 hours`);
    
    // Test 3: Calculate activity stats
    console.log('\n3. Calculating activity statistics...');
    const stats = {
      processes: activities.filter(a => a.type === 'process').length,
      baseMetals: activities.filter(a => a.type === 'base-metal').length,
      content: activities.filter(a => a.type === 'content').length,
      settings: activities.filter(a => a.type === 'settings').length,
      users: activities.filter(a => a.type === 'user').length
    };
    
    console.log('Activity Statistics:');
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Test 4: Show recent activities
    console.log('\n4. Recent Activities:');
    activities.slice(0, 5).forEach((activity, index) => {
      console.log(`  ${index + 1}. ${activity.userName} ${activity.action} ${activity.targetName} (${activity.type})`);
      console.log(`     Time: ${activity.timestamp.toLocaleString()}`);
    });
    
    console.log('\n✅ Activity tracking system is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing activity tracking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testActivityTracking(); 