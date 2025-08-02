import('node-fetch').then(({default: fetch}) => {

async function testProcessActivation() {
  try {
    console.log('Testing process activation API...\n');
    
    // Test 1: Get current activation status
    console.log('1. Getting current activation status...');
    const getResponse = await fetch('http://localhost:3000/api/content/process-activation');
    const processes = await getResponse.json();
    
    console.log('Current processes:');
    processes.forEach(process => {
      console.log(`  ${process.name}: ${process.isMenuActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    });
    
    // Test 2: Activate a process (Zinc Plating)
    console.log('\n2. Testing activation of Zinc Plating...');
    const activateResponse = await fetch('http://localhost:3000/api/content/process-activation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processSlug: 'zinc-plating',
        isMenuActive: true
      }),
    });
    
    if (activateResponse.ok) {
      console.log('✅ Zinc Plating activated successfully');
    } else {
      console.log('❌ Failed to activate Zinc Plating');
    }
    
    // Test 3: Deactivate a process (Copper Plating)
    console.log('\n3. Testing deactivation of Copper Plating...');
    const deactivateResponse = await fetch('http://localhost:3000/api/content/process-activation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processSlug: 'copper-plating',
        isMenuActive: false
      }),
    });
    
    if (deactivateResponse.ok) {
      console.log('✅ Copper Plating deactivated successfully');
    } else {
      console.log('❌ Failed to deactivate Copper Plating');
    }
    
    // Test 4: Get updated activation status
    console.log('\n4. Getting updated activation status...');
    const updatedResponse = await fetch('http://localhost:3000/api/content/process-activation');
    const updatedProcesses = await updatedResponse.json();
    
    console.log('Updated processes:');
    updatedProcesses.forEach(process => {
      console.log(`  ${process.name}: ${process.isMenuActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    });
    
    // Test 5: Check dashboard stats
    console.log('\n5. Checking dashboard stats...');
    const statsResponse = await fetch('http://localhost:3000/api/admin/stats/processes-count');
    const stats = await statsResponse.json();
    
    console.log(`Dashboard shows ${stats.count} active processes`);
    
  } catch (error) {
    console.error('❌ Error testing process activation:', error);
  }
}

testProcessActivation();
}); 