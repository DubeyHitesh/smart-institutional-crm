// Simple test to check backend
fetch('http://localhost:5001/api/setup/check')
  .then(response => {
    console.log('Backend status:', response.status);
    return response.json();
  })
  .then(data => console.log('Backend response:', data))
  .catch(error => console.error('Backend error:', error));