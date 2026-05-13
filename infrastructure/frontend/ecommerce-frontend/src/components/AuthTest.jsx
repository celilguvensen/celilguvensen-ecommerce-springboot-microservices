import { useState } from 'react';

export default function SimpleDebugTest() {
  const [result, setResult] = useState('');

  const testDirectCall = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setResult('❌ No token found in localStorage');
      return;
    }

    try {
      console.log('=== DIRECT TEST ===');
      console.log('Token from localStorage:', token.substring(0, 30) + '...');
      const response = await fetch('http://localhost:8085/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct call SUCCESS:', data);
        setResult(`✅ SUCCESS: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.text();
        console.error('❌ Direct call FAILED - Status:', response.status);
        console.error('Error response:', errorData);
        
        setResult(`❌ FAILED: 
Status: ${response.status}
Status Text: ${response.statusText}
Response: ${errorData}`);
      }
      
    } catch (error) {
      console.error('❌ Direct call FAILED:', error);
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    }
  };

  const testTokenDecode = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setResult('❌ No token found');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        setResult('❌ Invalid JWT format');
        return;
      }

      const payload = JSON.parse(atob(parts[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      setResult(`Token Info:
Username: ${payload.sub}
Role: ${payload.role}
UserId: ${payload.userId}
Email: ${payload.email}
Expires: ${new Date(payload.exp * 1000)}
Is Expired: ${isExpired}
Current Time: ${new Date()}

Full Payload: ${JSON.stringify(payload, null, 2)}`);
      
    } catch (error) {
      setResult(`❌ Token decode failed: ${error.message}`);
    }
  };

  const testServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/auth/test');
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Server is running: ${JSON.stringify(data)}`);
      } else {
        setResult(`❌ Server responded with: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Server not reachable: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Debug Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testServerHealth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          1. Test Server Health
        </button>
        
        <button
          onClick={testTokenDecode}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
        >
          2. Decode Token
        </button>
        
        <button
          onClick={testDirectCall}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          3. Test /api/auth/me Direct
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
        <h3 className="font-bold text-yellow-800">Test Sırası:</h3>
        <ol className="list-decimal list-inside text-yellow-700 mt-2">
          <li>Önce "Test Server Health" - Backend çalışıyor mu?</li>
          <li>Sonra "Decode Token" - Token geçerli mi?</li>
          <li>Son olarak "Test /api/auth/me Direct" - Endpoint çalışıyor mu?</li>
        </ol>
      </div>
    </div>
  );
}