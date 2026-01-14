const https = require('https');

async function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function whitelistCurrentIP() {
  try {
    const currentIP = await getCurrentIP();
    console.log(`Current IP: ${currentIP}`);
    console.log(`Add this IP to MongoDB Atlas: ${currentIP}/32`);
    console.log('Go to: Network Access → IP Access List → Add IP Address');
  } catch (error) {
    console.error('Error getting IP:', error);
  }
}

whitelistCurrentIP();