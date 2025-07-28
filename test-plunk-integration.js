#!/usr/bin/env node

/**
 * Plunk Integration Test Script
 * Tests the complete email signup and sequence enrollment flow
 */

const https = require('https');

// Test configuration
const TEST_CONFIG = {
  endpoint: process.env.TEST_ENDPOINT || 'https://overnightmvp.netlify.app/.netlify/functions/plunk-integration',
  localEndpoint: 'http://localhost:8888/.netlify/functions/plunk-integration',
  testEmail: 'test@example.com',
  maxRetries: 3,
  timeout: 10000
};

// Test cases
const testCases = [
  {
    name: 'Basic Email Signup',
    payload: {
      email: TEST_CONFIG.testEmail,
      source: 'test_script',
      sequence_type: 'validation-series'
    }
  },
  {
    name: 'Newsletter Signup',
    payload: {
      email: 'newsletter@example.com',
      source: 'test_script',
      sequence_type: 'newsletter'
    }
  },
  {
    name: 'Invalid Email Format',
    payload: {
      email: 'invalid-email',
      source: 'test_script',
      sequence_type: 'validation-series'
    },
    expectedError: true
  },
  {
    name: 'Missing Email',
    payload: {
      source: 'test_script',
      sequence_type: 'validation-series'
    },
    expectedError: true
  }
];

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Make HTTP request
function makeRequest(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: TEST_CONFIG.timeout
    };

    const request = (url.protocol === 'https:' ? https : require('http')).request(options, (response) => {
      let body = '';
      
      response.on('data', (chunk) => {
        body += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = {
            status: response.statusCode,
            headers: response.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (error) {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: { rawBody: body, parseError: error.message }
          });
        }
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });

    request.write(data);
    request.end();
  });
}

// Run a single test case
async function runTest(testCase, endpoint) {
  log(`\n🧪 Testing: ${testCase.name}`, 'blue');
  log(`📤 Payload: ${JSON.stringify(testCase.payload, null, 2)}`, 'yellow');
  
  try {
    const result = await makeRequest(endpoint, testCase.payload);
    
    log(`📥 Status: ${result.status}`, result.status < 400 ? 'green' : 'red');
    log(`📥 Response: ${JSON.stringify(result.body, null, 2)}`, 'yellow');
    
    // Validate results
    if (testCase.expectedError) {
      if (result.status >= 400) {
        log(`✅ Expected error received`, 'green');
        return { success: true, testCase: testCase.name };
      } else {
        log(`❌ Expected error but got success`, 'red');
        return { success: false, testCase: testCase.name, error: 'Expected error not received' };
      }
    } else {
      if (result.status >= 200 && result.status < 300) {
        log(`✅ Test passed`, 'green');
        return { success: true, testCase: testCase.name };
      } else {
        log(`❌ Test failed`, 'red');
        return { success: false, testCase: testCase.name, error: `HTTP ${result.status}` };
      }
    }
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
    return { success: false, testCase: testCase.name, error: error.message };
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting Plunk Integration Tests', 'blue');
  log(`🔗 Endpoint: ${TEST_CONFIG.endpoint}`, 'yellow');
  
  const results = [];
  
  for (const testCase of testCases) {
    const result = await runTest(testCase, TEST_CONFIG.endpoint);
    results.push(result);
    
    // Wait between tests to avoid rate limiting
    if (testCase !== testCases[testCases.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  log('\n📊 Test Results Summary', 'blue');
  log('=' * 50, 'blue');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`, 'yellow');
  
  if (failed > 0) {
    log('\n❌ Failed Tests:', 'red');
    results.filter(r => !r.success).forEach(result => {
      log(`  - ${result.testCase}: ${result.error}`, 'red');
    });
  }
  
  log('\n🏁 Testing Complete', 'blue');
  process.exit(failed > 0 ? 1 : 0);
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Plunk Integration Test Script

Usage:
  node test-plunk-integration.js [options]

Options:
  --local       Test against local development server
  --endpoint    Specify custom endpoint URL
  --help, -h    Show this help message

Environment Variables:
  TEST_ENDPOINT Custom endpoint URL (overrides --endpoint)
  PLUNK_API_KEY API key for testing (if testing locally)

Examples:
  node test-plunk-integration.js
  node test-plunk-integration.js --local
  node test-plunk-integration.js --endpoint https://custom-url.com/.netlify/functions/plunk-integration

Note: These tests will create actual contacts in your Plunk account.
Use test email addresses to avoid cluttering your real contact list.
    `);
    process.exit(0);
  }
  
  if (args.includes('--local')) {
    TEST_CONFIG.endpoint = TEST_CONFIG.localEndpoint;
    log('🏠 Testing against local development server', 'yellow');
  }
  
  const endpointIndex = args.indexOf('--endpoint');
  if (endpointIndex !== -1 && args[endpointIndex + 1]) {
    TEST_CONFIG.endpoint = args[endpointIndex + 1];
    log(`🔗 Using custom endpoint: ${TEST_CONFIG.endpoint}`, 'yellow');
  }
  
  runTests().catch(error => {
    log(`💥 Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests, runTest, testCases };