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

async function fixOrderStatus() {
  try {
    console.log('🔧 Fixing order status for completed orders...');
    
    // Fix the specific Ambher order mentioned (Order ID 256)
    const ambherOrder = await PatientOrderAmbher.findOneAndUpdate(
      { patientorderambherid: 256 },
      { 
        patientorderambherstatus: 'Completed',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (ambherOrder) {
      console.log(`✅ Fixed Ambher Order ID 256:`, {
        id: ambherOrder.patientorderambherid,
        patient: `${ambherOrder.patientfirstname} ${ambherOrder.patientlastname}`,
        status: ambherOrder.patientorderambherstatus,
        phone: ambherOrder.patientcontactnumber
      });
    } else {
      console.log('❌ Ambher Order ID 256 not found');
    }
    
    // Let's also check for any other orders that should be marked as completed
    console.log('\n🔍 Looking for other orders that might need status correction...');
    
    // Find orders with "Ready for Pickup" status that have old pickup dates (more than 3 days ago)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoString = threeDaysAgo.toISOString().split('T')[0];
    
    console.log(`📅 Checking for "Ready for Pickup" orders with pickup dates before: ${threeDaysAgoString}`);
    
    // Check Ambher orders
    const oldAmbherOrders = await PatientOrderAmbher.find({
      patientorderambherstatus: 'Ready for Pickup',
      patientorderambherproductchosenpickupdate: { $lt: threeDaysAgoString }
    }).select('patientorderambherid patientfirstname patientlastname patientorderambherstatus patientorderambherproductchosenpickupdate');
    
    console.log(`📋 Found ${oldAmbherOrders.length} old Ambher "Ready for Pickup" orders:`);
    oldAmbherOrders.forEach(order => {
      console.log(`   - Order ${order.patientorderambherid}: ${order.patientfirstname} ${order.patientlastname} (Pickup: ${order.patientorderambherproductchosenpickupdate})`);
    });
    
    // Check Bautista orders
    const oldBautistaOrders = await PatientOrderBautista.find({
      patientorderbautistastatus: 'Ready for Pickup',
      patientorderbautistaproductchosenpickupdate: { $lt: threeDaysAgoString }
    }).select('patientorderbautistaid patientfirstname patientlastname patientorderbautistastatus patientorderbautistaproductchosenpickupdate');
    
    console.log(`📋 Found ${oldBautistaOrders.length} old Bautista "Ready for Pickup" orders:`);
    oldBautistaOrders.forEach(order => {
      console.log(`   - Order ${order.patientorderbautistaid}: ${order.patientfirstname} ${order.patientlastname} (Pickup: ${order.patientorderbautistaproductchosenpickupdate})`);
    });
    
    // Optionally auto-complete very old orders (uncomment if you want to auto-fix)
    /*
    if (oldAmbherOrders.length > 0) {
      const ambherUpdated = await PatientOrderAmbher.updateMany(
        { 
          patientorderambherstatus: 'Ready for Pickup',
          patientorderambherproductchosenpickupdate: { $lt: threeDaysAgoString }
        },
        { 
          patientorderambherstatus: 'Completed',
          updatedAt: new Date()
        }
      );
      console.log(`✅ Auto-completed ${ambherUpdated.modifiedCount} old Ambher orders`);
    }
    
    if (oldBautistaOrders.length > 0) {
      const bautistaUpdated = await PatientOrderBautista.updateMany(
        { 
          patientorderbautistastatus: 'Ready for Pickup',
          patientorderbautistaproductchosenpickupdate: { $lt: threeDaysAgoString }
        },
        { 
          patientorderbautistastatus: 'Completed',
          updatedAt: new Date()
        }
      );
      console.log(`✅ Auto-completed ${bautistaUpdated.modifiedCount} old Bautista orders`);
    }
    */
    
    console.log('\n✅ Order status fix complete!');
    
  } catch (error) {
    console.error('❌ Error fixing order status:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixOrderStatus();
