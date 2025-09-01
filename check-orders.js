import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eye2wear', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas (simplified)
const PatientOrderAmbherSchema = new mongoose.Schema({}, { strict: false });
const PatientOrderBautistaSchema = new mongoose.Schema({}, { strict: false });

const PatientOrderAmbher = mongoose.model('PatientOrderAmbher', PatientOrderAmbherSchema, 'patientorderambhers');
const PatientOrderBautista = mongoose.model('PatientOrderBautista', PatientOrderBautistaSchema, 'patientorderbautistas');

async function checkOrders() {
  try {
    console.log('=== AMBHER ORDERS ===');
    const ambherOrders = await PatientOrderAmbher.find({})
      .select('patientorderambherid patientorderambherstatus patientorderambheramountpaid createdAt')
      .limit(5);
    console.log('Sample Ambher Orders:', JSON.stringify(ambherOrders, null, 2));
    
    const ambherCompleted = await PatientOrderAmbher.countDocuments({ patientorderambherstatus: 'Completed' });
    console.log('Completed Ambher Orders:', ambherCompleted);
    
    const ambherAll = await PatientOrderAmbher.countDocuments({});
    console.log('Total Ambher Orders:', ambherAll);
    
    console.log('\n=== BAUTISTA ORDERS ===');
    const bautistaOrders = await PatientOrderBautista.find({})
      .select('patientorderbautistaid patientorderbautistastatus patientorderbautistaamountpaid createdAt')
      .limit(5);
    console.log('Sample Bautista Orders:', JSON.stringify(bautistaOrders, null, 2));
    
    const bautistaCompleted = await PatientOrderBautista.countDocuments({ patientorderbautistastatus: 'Completed' });
    console.log('Completed Bautista Orders:', bautistaCompleted);
    
    const bautistaAll = await PatientOrderBautista.countDocuments({});
    console.log('Total Bautista Orders:', bautistaAll);
    
    console.log('\n=== REVENUE TEST ===');
    // Test revenue aggregation for Ambher
    const ambherRevenue = await PatientOrderAmbher.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$patientorderambheramountpaid' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$patientorderambheramountpaid' }
        }
      }
    ]);
    console.log('Ambher Revenue Aggregation:', ambherRevenue);
    
    // Test revenue aggregation for Bautista
    const bautistaRevenue = await PatientOrderBautista.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$patientorderbautistaamountpaid' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$patientorderbautistaamountpaid' }
        }
      }
    ]);
    console.log('Bautista Revenue Aggregation:', bautistaRevenue);
    
    // Check for any orders with revenue > 0
    console.log('\n=== ORDERS WITH REVENUE ===');
    const ambherWithRevenue = await PatientOrderAmbher.find({ 
      patientorderambheramountpaid: { $gt: 0 } 
    }).select('patientorderambherid patientorderambherstatus patientorderambheramountpaid').limit(3);
    console.log('Ambher Orders with Revenue:', ambherWithRevenue);
    
    const bautistaWithRevenue = await PatientOrderBautista.find({ 
      patientorderbautistaamountpaid: { $gt: 0 } 
    }).select('patientorderbautistaid patientorderbautistastatus patientorderbautistaamountpaid').limit(3);
    console.log('Bautista Orders with Revenue:', bautistaWithRevenue);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkOrders();
