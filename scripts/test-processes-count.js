const fetch = require('node-fetch');

async function testProcessesCount() {
  try {
    console.log('Testing processes count API...');
    
    const response = await fetch('http://localhost:3000/api/admin/stats/processes-count');
    const data = await response.json();
    
    console.log('Processes count response:', data);
    console.log('Active processes count:', data.count);
    
    if (data.count >= 0) {
      console.log('✅ API is working correctly');
    } else {
      console.log('❌ API returned invalid count');
    }
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testProcessesCount(); 