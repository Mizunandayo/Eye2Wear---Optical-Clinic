// Test file to verify email checking across all account types
// This is a simple test to verify our email checking implementation

const testEmailCheck = async (email) => {
    console.log(`Testing email: ${email}`);
    
    try {
        // Test all endpoints like in PatientRegistration.jsx
        const patientResponse = await fetch(`/api/patientaccounts/check-email/${encodeURIComponent(email)}`);
        const adminResponse = await fetch(`/api/adminaccounts/check-email/${encodeURIComponent(email)}`);
        const staffResponse = await fetch(`/api/staffaccounts/check-email/${encodeURIComponent(email)}`);
        const ownerResponse = await fetch(`/api/owneraccounts/check-email/${encodeURIComponent(email)}`);
        
        const patientData = await patientResponse.json();
        const adminData = await adminResponse.json();
        const staffData = await staffResponse.json();
        const ownerData = await ownerResponse.json();
        
        const emailExists = patientData.exists || adminData.exists || staffData.exists || ownerData.exists;
        
        console.log(`Results for ${email}:`);
        console.log(`- Patient: ${patientData.exists}`);
        console.log(`- Admin: ${adminData.exists}`);
        console.log(`- Staff: ${staffData.exists}`);
        console.log(`- Owner: ${ownerData.exists}`);
        console.log(`- Overall exists: ${emailExists}`);
        
        return emailExists;
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
};

// Example usage:
// testEmailCheck('test@example.com');

export default testEmailCheck;