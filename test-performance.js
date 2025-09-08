/**
 * Performance Test Script for Eye2Wear API Optimizations
 * Tests the before/after performance of pagination and query optimizations
 */

import fetch from 'node-fetch';

class PerformanceTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async runTest(name, testFunction, iterations = 3) {
    console.log(`\n🧪 Running test: ${name}`);
    console.log(`   Iterations: ${iterations}`);
    
    const times = [];
    let errors = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        const result = await testFunction();
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        times.push({
          iteration: i + 1,
          duration: duration,
          success: result.success,
          dataSize: result.dataSize || 0,
          recordCount: result.recordCount || 0
        });
        
        console.log(`   Iteration ${i + 1}: ${duration.toFixed(2)}ms (${result.recordCount} records, ${(result.dataSize / 1024).toFixed(2)}KB)`);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errors++;
        console.log(`   Iteration ${i + 1}: ERROR - ${error.message}`);
      }
    }

    const successfulTimes = times.filter(t => t.success);
    if (successfulTimes.length === 0) {
      console.log(`   ❌ All iterations failed`);
      return null;
    }

    const avgTime = successfulTimes.reduce((sum, t) => sum + t.duration, 0) / successfulTimes.length;
    const minTime = Math.min(...successfulTimes.map(t => t.duration));
    const maxTime = Math.max(...successfulTimes.map(t => t.duration));
    const avgDataSize = successfulTimes.reduce((sum, t) => sum + t.dataSize, 0) / successfulTimes.length;
    const avgRecordCount = successfulTimes.reduce((sum, t) => sum + t.recordCount, 0) / successfulTimes.length;

    const result = {
      name,
      avgTime: avgTime.toFixed(2),
      minTime: minTime.toFixed(2),
      maxTime: maxTime.toFixed(2),
      successRate: ((successfulTimes.length / iterations) * 100).toFixed(1),
      avgDataSize: (avgDataSize / 1024).toFixed(2),
      avgRecordCount: Math.round(avgRecordCount),
      errors
    };

    console.log(`   ✅ Average: ${result.avgTime}ms`);
    console.log(`   📊 Range: ${result.minTime}ms - ${result.maxTime}ms`);
    console.log(`   📈 Success Rate: ${result.successRate}%`);
    console.log(`   💾 Avg Data Size: ${result.avgDataSize}KB`);
    console.log(`   📦 Avg Records: ${result.avgRecordCount}`);

    this.results.push(result);
    return result;
  }

  async testOriginalAPI() {
    return this.runTest('Original API (All Orders)', async () => {
      const response = await fetch(`${this.baseUrl}/api/patientorderambher`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const dataSize = JSON.stringify(data).length;
      
      return {
        success: true,
        dataSize,
        recordCount: Array.isArray(data) ? data.length : (data.orders ? data.orders.length : 0)
      };
    });
  }

  async testPaginatedAPI() {
    return this.runTest('Optimized API (Page 1, 20 items)', async () => {
      const response = await fetch(`${this.baseUrl}/api/patientorderambher?page=1&limit=20`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const dataSize = JSON.stringify(data).length;
      
      return {
        success: true,
        dataSize,
        recordCount: data.orders ? data.orders.length : (Array.isArray(data) ? data.length : 0)
      };
    });
  }

  async testFilteredAPI() {
    return this.runTest('Optimized API (Filtered - Pending)', async () => {
      const response = await fetch(`${this.baseUrl}/api/patientorderambher?page=1&limit=20&status=Pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const dataSize = JSON.stringify(data).length;
      
      return {
        success: true,
        dataSize,
        recordCount: data.orders ? data.orders.length : (Array.isArray(data) ? data.length : 0)
      };
    });
  }

  async testSearchAPI() {
    return this.runTest('Optimized API (Search)', async () => {
      const response = await fetch(`${this.baseUrl}/api/patientorderambher?page=1&limit=20&search=lens`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const dataSize = JSON.stringify(data).length;
      
      return {
        success: true,
        dataSize,
        recordCount: data.orders ? data.orders.length : (Array.isArray(data) ? data.length : 0)
      };
    });
  }

  async testBautistaAPI() {
    return this.runTest('Bautista Orders (Paginated)', async () => {
      const response = await fetch(`${this.baseUrl}/api/patientorderbautista?page=1&limit=20`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const dataSize = JSON.stringify(data).length;
      
      return {
        success: true,
        dataSize,
        recordCount: data.orders ? data.orders.length : (Array.isArray(data) ? data.length : 0)
      };
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 PERFORMANCE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));

    if (this.results.length === 0) {
      console.log('No test results available.');
      return;
    }

    // Table header
    console.log('Test Name'.padEnd(35) + 
                'Avg Time'.padEnd(12) + 
                'Data Size'.padEnd(12) + 
                'Records'.padEnd(10) + 
                'Success'.padEnd(10));
    console.log('-'.repeat(80));

    // Results
    this.results.forEach(result => {
      console.log(
        result.name.padEnd(35) + 
        `${result.avgTime}ms`.padEnd(12) + 
        `${result.avgDataSize}KB`.padEnd(12) + 
        result.avgRecordCount.toString().padEnd(10) + 
        `${result.successRate}%`.padEnd(10)
      );
    });

    // Performance Analysis
    console.log('\n📊 PERFORMANCE ANALYSIS:');
    
    const originalTest = this.results.find(r => r.name.includes('Original'));
    const paginatedTest = this.results.find(r => r.name.includes('Optimized API (Page 1'));
    
    if (originalTest && paginatedTest) {
      const timeImprovement = ((originalTest.avgTime - paginatedTest.avgTime) / originalTest.avgTime * 100);
      const sizeReduction = ((originalTest.avgDataSize - paginatedTest.avgDataSize) / originalTest.avgDataSize * 100);
      
      console.log(`   ⚡ Response Time Improvement: ${timeImprovement.toFixed(1)}%`);
      console.log(`   💾 Data Size Reduction: ${sizeReduction.toFixed(1)}%`);
      console.log(`   📦 Records per Request: ${originalTest.avgRecordCount} → ${paginatedTest.avgRecordCount}`);
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    this.results.forEach(result => {
      if (parseFloat(result.avgTime) > 1000) {
        console.log(`   ⚠️  ${result.name}: Consider further optimization (${result.avgTime}ms)`);
      } else if (parseFloat(result.avgTime) < 100) {
        console.log(`   ✅ ${result.name}: Excellent performance (${result.avgTime}ms)`);
      } else {
        console.log(`   👍 ${result.name}: Good performance (${result.avgTime}ms)`);
      }
    });

    console.log('\n' + '='.repeat(80));
  }

  async runAllTests() {
    console.log('🚀 Starting Eye2Wear API Performance Tests...');
    console.log(`📡 Testing against: ${this.baseUrl}`);

    try {
      // Test server availability
      console.log('\n🔍 Checking server availability...');
      const healthCheck = await fetch(`${this.baseUrl}/`);
      if (!healthCheck.ok) {
        throw new Error('Server is not responding');
      }
      console.log('✅ Server is running');

      // Run tests
      await this.testOriginalAPI();
      await this.testPaginatedAPI();
      await this.testFilteredAPI();
      await this.testSearchAPI();
      await this.testBautistaAPI();

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      console.log('\nMake sure the server is running on port 3000');
    }
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

export default PerformanceTester;
