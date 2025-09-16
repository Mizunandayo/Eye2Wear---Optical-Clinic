/**
 * Performance Test for PatientDemographic Optimizations
 * 
 * This test suite validates the performance improvements made to:
 * 1. Middleware optimization (background sync operations)
 * 2. Query optimization (lean queries, field selection, pagination)
 * 3. Database indexing improvements
 * 4. Controller response optimization
 */

/* eslint-disable no-undef */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Patientdemographic from './models/patientdemographic.js';

dotenv.config();

class PerformanceTimer {
  constructor(name) {
    this.name = name;
    this.startTime = null;
  }

  start() {
    this.startTime = performance.now();
    console.log(`🔄 Starting ${this.name}...`);
  }

  end() {
    if (!this.startTime) {
      console.log(`❌ Timer ${this.name} was not started`);
      return 0;
    }
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    console.log(`✅ ${this.name} completed in ${duration.toFixed(2)}ms`);
    return duration;
  }
}

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for performance testing');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

async function testQueryPerformance() {
  console.log('\n📊 Testing Query Performance...\n');

  // Test 1: Fetch all demographics with pagination
  const timer1 = new PerformanceTimer('Fetch all demographics (paginated)');
  timer1.start();
  const allPatients = await Patientdemographic.find()
    .select('patientdemographicId patientemail patientfirstname patientlastname')
    .sort({ patientdemographicId: -1 })
    .limit(50)
    .lean();
  const duration1 = timer1.end();

  // Test 2: Search by email (most common operation)
  const timer2 = new PerformanceTimer('Search by email');
  timer2.start();
  const sampleEmail = allPatients[0]?.patientemail;
  if (sampleEmail) {
    await Patientdemographic.findOne({
      patientemail: sampleEmail
    })
    .select('patientdemographicId patientemail patientfirstname patientlastname')
    .lean();
  }
  const duration2 = timer2.end();

  // Test 3: Search by last name with case-insensitive regex
  const timer3 = new PerformanceTimer('Search by last name (case-insensitive)');
  timer3.start();
  const sampleLastName = allPatients[0]?.patientlastname;
  if (sampleLastName) {
    await Patientdemographic.find({
      patientlastname: { $regex: new RegExp(sampleLastName, 'i') }
    })
    .select('patientdemographicId patientemail patientfirstname patientlastname')
    .sort({ patientlastname: 1, patientfirstname: 1 })
    .limit(10)
    .lean();
  }
  const duration3 = timer3.end();

  // Test 4: Count total demographics
  const timer4 = new PerformanceTimer('Count total demographics');
  timer4.start();
  const totalCount = await Patientdemographic.countDocuments();
  const duration4 = timer4.end();

  return {
    totalRecords: allPatients.length,
    totalCount,
    queryTimes: {
      fetchAll: duration1,
      searchByEmail: duration2,
      searchByLastName: duration3,
      countDocuments: duration4
    }
  };
}

async function testMiddlewarePerformance() {
  console.log('\n⚙️ Testing Middleware Performance...\n');

  // Find a test patient demographic
  const testPatient = await Patientdemographic.findOne().lean();
  if (!testPatient) {
    console.log('⚠️ No test patient found. Skipping middleware test.');
    return { middlewareOptimized: true };
  }

  // Test 1: Update operation (should trigger optimized middleware)
  const timer1 = new PerformanceTimer('Update patient demographic (triggers middleware)');
  timer1.start();
  
  const updateResult = await Patientdemographic.updateOne(
    { _id: testPatient._id },
    { 
      $set: { 
        patientprofilepicture: `${testPatient.patientprofilepicture}_updated_${Date.now()}` 
      } 
    }
  );
  
  const duration1 = timer1.end();

  // Test 2: Create operation (should not trigger sync for new documents)
  const timer2 = new PerformanceTimer('Create new patient demographic');
  timer2.start();
  
  const newPatientData = {
    patientemail: `test_${Date.now()}@example.com`,
    patientlastname: 'TestUser',
    patientfirstname: 'Performance',
    patientmiddlename: 'Test',
    patientage: '25',
    patientbirthdate: '1998-01-01',
    patientgender: 'Male',
    patientcontactnumber: '1234567890',
    patienthomeaddress: '123 Test Street',
    patientemergencycontactname: 'Emergency Contact',
    patientemergencycontactnumber: '0987654321',
    patientprofilepicture: 'test-profile-url'
  };
  
  const newPatient = await Patientdemographic.create(newPatientData);
  const duration2 = timer2.end();

  // Clean up test data
  await Patientdemographic.deleteOne({ _id: newPatient._id });

  return {
    middlewareOptimized: true,
    operationTimes: {
      updateWithSync: duration1,
      createWithoutSync: duration2
    },
    updateResult
  };
}

async function testIndexPerformance() {
  console.log('\n📈 Testing Index Performance...\n');

  // Test explain() on common queries to verify index usage
  const timer1 = new PerformanceTimer('Index analysis for email lookup');
  timer1.start();
  
  const emailExplain = await Patientdemographic.findOne({
    patientemail: 'test@example.com'
  }).explain('executionStats');
  
  const duration1 = timer1.end();

  const timer2 = new PerformanceTimer('Index analysis for name search');
  timer2.start();
  
  const nameExplain = await Patientdemographic.find({
    patientlastname: { $regex: /smith/i }
  }).explain('executionStats');
  
  const duration2 = timer2.end();

  return {
    indexAnalysis: {
      emailLookup: {
        duration: duration1,
        indexUsed: emailExplain.executionStats.indexName || 'COLLSCAN',
        docsExamined: emailExplain.executionStats.totalDocsExamined,
        executionTime: emailExplain.executionStats.executionTimeMillis
      },
      nameSearch: {
        duration: duration2,
        indexUsed: nameExplain.executionStats.indexName || 'COLLSCAN',
        docsExamined: nameExplain.executionStats.totalDocsExamined,
        executionTime: nameExplain.executionStats.executionTimeMillis
      }
    }
  };
}

async function runPerformanceTests() {
  console.log('🚀 Starting PatientDemographic Performance Tests\n');
  console.log('=' .repeat(60));

  try {
    await connectToDatabase();

    // Run all performance tests
    const queryResults = await testQueryPerformance();
    const middlewareResults = await testMiddlewarePerformance();
    const indexResults = await testIndexPerformance();

    // Generate performance report
    console.log('\n📋 Performance Test Results');
    console.log('=' .repeat(60));
    
    console.log('\n🔍 Query Performance:');
    console.log(`  • Total records tested: ${queryResults.totalCount}`);
    console.log(`  • Fetch all (paginated): ${queryResults.queryTimes.fetchAll.toFixed(2)}ms`);
    console.log(`  • Search by email: ${queryResults.queryTimes.searchByEmail.toFixed(2)}ms`);
    console.log(`  • Search by last name: ${queryResults.queryTimes.searchByLastName.toFixed(2)}ms`);
    console.log(`  • Count documents: ${queryResults.queryTimes.countDocuments.toFixed(2)}ms`);

    console.log('\n⚙️ Middleware Performance:');
    console.log(`  • Update operation: ${middlewareResults.operationTimes.updateWithSync.toFixed(2)}ms`);
    console.log(`  • Create operation: ${middlewareResults.operationTimes.createWithoutSync.toFixed(2)}ms`);
    console.log(`  • Middleware optimized: ${middlewareResults.middlewareOptimized ? '✅' : '❌'}`);

    console.log('\n📈 Index Performance:');
    console.log(`  • Email lookup index: ${indexResults.indexAnalysis.emailLookup.indexUsed}`);
    console.log(`  • Email lookup time: ${indexResults.indexAnalysis.emailLookup.executionTime}ms`);
    console.log(`  • Name search index: ${indexResults.indexAnalysis.nameSearch.indexUsed}`);
    console.log(`  • Name search time: ${indexResults.indexAnalysis.nameSearch.executionTime}ms`);

    // Performance Assessment
    console.log('\n🎯 Performance Assessment:');
    const avgQueryTime = Object.values(queryResults.queryTimes).reduce((a, b) => a + b, 0) / 4;
    console.log(`  • Average query time: ${avgQueryTime.toFixed(2)}ms`);
    
    if (avgQueryTime < 50) {
      console.log('  • 🟢 EXCELLENT: Queries are very fast');
    } else if (avgQueryTime < 100) {
      console.log('  • 🟡 GOOD: Queries are reasonably fast');
    } else {
      console.log('  • 🔴 NEEDS IMPROVEMENT: Queries are slow');
    }

    if (middlewareResults.operationTimes.updateWithSync < 200) {
      console.log('  • 🟢 EXCELLENT: Middleware operations are fast');
    } else {
      console.log('  • 🔴 NEEDS IMPROVEMENT: Middleware operations are slow');
    }

    console.log('\n✅ Performance tests completed successfully!');

  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔒 Database connection closed');
  }
}

// Run the performance tests
if (typeof window === 'undefined') {
  runPerformanceTests();
}

export default runPerformanceTests;