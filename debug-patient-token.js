import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import PatientAppointment from './models/patientappointment.js';
import Patientaccount from './models/patientaccount.js';
import process from 'process';

dotenv.config();

async function debugPatientToken() {
    try {
        console.log('🔍 Patient Token Debug Tool');
        console.log('=' .repeat(50));
        
        // First, let's check appointment 171
        const appointment = await PatientAppointment.findOne({ 
            patientappointmentid: 171 
        });
        
        if (!appointment) {
            console.log('❌ Appointment 171 not found');
            return;
        }
        
        console.log('📅 Appointment 171 Details:');
        console.log(`   Patient Name: ${appointment.patientappointmentfirstname} ${appointment.patientappointmentlastname}`);
        console.log(`   Patient Email: "${appointment.patientappointmentemail}"`);
        console.log(`   Status: ${appointment.patientappointmentstatus}`);
        console.log(`   Ambher Status: ${appointment.patientambherappointmentstatus}`);
        console.log(`   Bautista Status: ${appointment.patientbautistaappointmentstatus}`);
        
        // Find patient account with this email
        const patientAccount = await Patientaccount.findOne({
            patientemail: appointment.patientappointmentemail
        });
        
        if (!patientAccount) {
            console.log('❌ No patient account found with this email');
            return;
        }
        
        console.log('\n👤 Patient Account Details:');
        console.log(`   Account Email: "${patientAccount.patientemail}"`);
        console.log(`   Account Name: ${patientAccount.patientfirstname} ${patientAccount.patientlastname}`);
        console.log(`   Account ID: ${patientAccount._id}`);
        
        // Generate a test token for this patient
        const testToken = jwt.sign(
            {
                id: patientAccount._id,
                email: patientAccount.patientemail,
                role: 'patient'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        console.log('\n🔑 Generated Test Token:');
        console.log(`   Token: ${testToken}`);
        
        // Decode the token to verify
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
        console.log('\n🔓 Decoded Token:');
        console.log(`   ID: ${decoded.id}`);
        console.log(`   Email: "${decoded.email}"`);
        console.log(`   Role: ${decoded.role}`);
        
        // Check email match
        const emailsMatch = appointment.patientappointmentemail === decoded.email;
        console.log('\n🔍 Email Comparison:');
        console.log(`   Appointment Email: "${appointment.patientappointmentemail}"`);
        console.log(`   Token Email: "${decoded.email}"`);
        console.log(`   Match: ${emailsMatch ? '✅ YES' : '❌ NO'}`);
        
        if (!emailsMatch) {
            console.log('\n🚨 EMAIL MISMATCH DETECTED!');
            console.log('   This is why the authorization is failing.');
            console.log('   The appointment email and token email must match exactly.');
            
            // Check for whitespace or case differences
            console.log('\n📋 Detailed Analysis:');
            console.log(`   Appointment email length: ${appointment.patientappointmentemail.length}`);
            console.log(`   Token email length: ${decoded.email.length}`);
            console.log(`   Appointment email (trimmed): "${appointment.patientappointmentemail.trim()}"`);
            console.log(`   Token email (trimmed): "${decoded.email.trim()}"`);
            console.log(`   Case-insensitive match: ${appointment.patientappointmentemail.toLowerCase() === decoded.email.toLowerCase()}`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ Debug complete');
        
    } catch (error) {
        console.error('❌ Debug error:', error);
    }
}

// Run the debug
debugPatientToken().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});