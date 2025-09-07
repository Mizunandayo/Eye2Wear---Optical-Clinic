import mongoose from 'mongoose';
import PatientOrderAmbher from '../models/patientorderambher.js';
import PatientOrderBautista from '../models/patientorderbautista.js';

/**
 * Database Optimization Utility for Orders Collections
 * This script creates optimal indexes for faster order queries
 */

class OrdersDatabaseOptimizer {
  
  /**
   * Create optimal indexes for Ambher Orders collection
   */
  static async createAmbherOrderIndexes() {
    try {
      console.log('🔧 Creating indexes for Ambher Orders...');
      
      const collection = mongoose.connection.collection('patientorderambhers');
      
      // Helper function to create index if it doesn't exist
      const createIndexSafely = async (indexSpec, options) => {
        try {
          await collection.createIndex(indexSpec, options);
          console.log(`✅ Created index: ${options.name}`);
        } catch (error) {
          if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
            console.log(`ℹ️  Index already exists: ${options.name}`);
          } else {
            throw error;
          }
        }
      };
      
      // Index for order status filtering
      await createIndexSafely(
        { patientorderambherstatus: 1 },
        { background: true, name: 'idx_ambher_status' }
      );
      
      // Index for date sorting (most common sort)
      await createIndexSafely(
        { patientorderambherid: -1 },
        { background: true, name: 'idx_ambher_id_desc' }
      );
      
      // Compound index for filtering + sorting
      await createIndexSafely(
        { patientorderambherstatus: 1, patientorderambherid: -1 },
        { background: true, name: 'idx_ambher_status_id_desc' }
      );
      
      // Text index for search functionality
      await createIndexSafely(
        {
          patientorderambherproductname: 'text',
          patientfirstname: 'text',
          patientlastname: 'text',
          patientemail: 'text'
        },
        { 
          background: true, 
          name: 'idx_ambher_search_text',
          weights: {
            patientorderambherproductname: 10,
            patientfirstname: 5,
            patientlastname: 5,
            patientemail: 3
          }
        }
      );
      
      // Index for pickup date queries
      await createIndexSafely(
        { patientorderambherproductchosenpickupdate: 1 },
        { background: true, name: 'idx_ambher_pickup_date' }
      );
      
      // Index for email lookups
      await createIndexSafely(
        { patientemail: 1 },
        { background: true, name: 'idx_ambher_email' }
      );
      
      console.log('✅ Ambher Orders indexes optimization completed');
      
    } catch (error) {
      console.error('❌ Error creating Ambher Orders indexes:', error);
    }
  }
  
  /**
   * Create optimal indexes for Bautista Orders collection
   */
  static async createBautistaOrderIndexes() {
    try {
      console.log('🔧 Creating indexes for Bautista Orders...');
      
      const collection = mongoose.connection.collection('patientorderbautistas');
      
      // Helper function to create index if it doesn't exist
      const createIndexSafely = async (indexSpec, options) => {
        try {
          await collection.createIndex(indexSpec, options);
          console.log(`✅ Created index: ${options.name}`);
        } catch (error) {
          if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
            console.log(`ℹ️  Index already exists: ${options.name}`);
          } else {
            throw error;
          }
        }
      };
      
      // Index for order status filtering
      await createIndexSafely(
        { patientorderbautistastatus: 1 },
        { background: true, name: 'idx_bautista_status' }
      );
      
      // Index for date sorting (most common sort)
      await createIndexSafely(
        { patientorderbautistaid: -1 },
        { background: true, name: 'idx_bautista_id_desc' }
      );
      
      // Compound index for filtering + sorting
      await createIndexSafely(
        { patientorderbautistastatus: 1, patientorderbautistaid: -1 },
        { background: true, name: 'idx_bautista_status_id_desc' }
      );
      
      // Text index for search functionality
      await createIndexSafely(
        {
          patientorderbautistaproductname: 'text',
          patientfirstname: 'text',
          patientlastname: 'text',
          patientemail: 'text'
        },
        { 
          background: true, 
          name: 'idx_bautista_search_text',
          weights: {
            patientorderbautistaproductname: 10,
            patientfirstname: 5,
            patientlastname: 5,
            patientemail: 3
          }
        }
      );
      
      // Index for pickup date queries
      await createIndexSafely(
        { patientorderbautistaproductchosenpickupdate: 1 },
        { background: true, name: 'idx_bautista_pickup_date' }
      );
      
      // Index for email lookups
      await createIndexSafely(
        { patientemail: 1 },
        { background: true, name: 'idx_bautista_email' }
      );
      
      console.log('✅ Bautista Orders indexes optimization completed');
      
    } catch (error) {
      console.error('❌ Error creating Bautista Orders indexes:', error);
    }
  }
  
  /**
   * Create all order indexes
   */
  static async createAllOrderIndexes() {
    console.log('🚀 Starting Orders Database Optimization...');
    
    await Promise.all([
      this.createAmbherOrderIndexes(),
      this.createBautistaOrderIndexes()
    ]);
    
    console.log('🎉 Orders Database Optimization completed!');
  }
  
  /**
   * Check existing indexes
   */
  static async checkExistingIndexes() {
    try {
      console.log('📊 Checking existing indexes...');
      
      const ambherCollection = mongoose.connection.collection('patientorderambhers');
      const bautistaCollection = mongoose.connection.collection('patientorderbautistas');
      
      const [ambherIndexes, bautistaIndexes] = await Promise.all([
        ambherCollection.indexes(),
        bautistaCollection.indexes()
      ]);
      
      console.log('📋 Ambher Orders Indexes:', ambherIndexes.map(idx => idx.name));
      console.log('📋 Bautista Orders Indexes:', bautistaIndexes.map(idx => idx.name));
      
      return { ambherIndexes, bautistaIndexes };
      
    } catch (error) {
      console.error('❌ Error checking indexes:', error);
    }
  }
  
  /**
   * Analyze query performance
   */
  static async analyzeQueryPerformance() {
    try {
      console.log('🔍 Analyzing query performance...');
      
      // Test common queries
      const testQueries = [
        // Status filter query
        PatientOrderAmbher.find({ patientorderambherstatus: 'Pending' })
          .select('patientorderambherid patientorderambherstatus patientfirstname')
          .sort({ patientorderambherid: -1 })
          .limit(10)
          .explain('executionStats'),
          
        // Search query
        PatientOrderAmbher.find({
          $or: [
            { patientorderambherproductname: { $regex: 'lens', $options: 'i' } },
            { patientfirstname: { $regex: 'john', $options: 'i' } }
          ]
        })
        .select('patientorderambherid patientorderambherstatus patientfirstname')
        .limit(10)
        .explain('executionStats')
      ];
      
      const results = await Promise.all(testQueries);
      
      results.forEach((result, index) => {
        const stats = result.executionStats;
        console.log(`📊 Query ${index + 1} Performance:`);
        console.log(`   - Documents Examined: ${stats.totalDocsExamined}`);
        console.log(`   - Documents Returned: ${stats.totalDocsReturned}`);
        console.log(`   - Execution Time: ${stats.executionTimeMillis}ms`);
        console.log(`   - Index Used: ${stats.executionStages?.indexName || 'None'}`);
      });
      
    } catch (error) {
      console.error('❌ Error analyzing query performance:', error);
    }
  }
}

export default OrdersDatabaseOptimizer;
