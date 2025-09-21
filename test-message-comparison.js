// Message length comparison for appointment SMS
const patientFirstName = "Velasco";
const appointmentDate = "2025-10-03";
const appointmentTime = "2:00 PM";
const clinicName = "Ambher Optical";
const appointmentLocation = "#032 Subic Street, Olongapo";

// Decline message (working)
const declineMessage = `Appointment Declined

Dear ${patientFirstName},

We regret to inform you that your appointment request has been DECLINED.

Original Request Details:
Date: ${appointmentDate}
Time: ${appointmentTime}
Clinic: ${clinicName}
Location: ${appointmentLocation}

We apologize for any inconvenience. Please feel free to request a different appointment date/time that may better suit our availability.

You can book a new appointment through our system or contact us directly for assistance.

Thank you for your understanding.

${clinicName}`;

// Cancellation message (not working)
const cancelMessage = `Appointment Cancelled

Dear ${patientFirstName},

We regret to inform you that your confirmed appointment has been CANCELLED due to unforeseen circumstances.

Cancelled Appointment Details:
Date: ${appointmentDate}
Time: ${appointmentTime}
Clinic: ${clinicName}
Location: ${appointmentLocation}

We sincerely apologize for any inconvenience this may cause.
You can book a new appointment through our system or contact us directly for immediate assistance.
Thank you for your understanding.

${clinicName}`;

console.log('📊 MESSAGE COMPARISON:');
console.log('Decline message length:', declineMessage.length);
console.log('Cancel message length:', cancelMessage.length);
console.log('Length difference:', declineMessage.length - cancelMessage.length);

console.log('\n📝 DECLINE MESSAGE:');
console.log(declineMessage);
console.log('\n📝 CANCEL MESSAGE:');
console.log(cancelMessage);

// Check for any special characters
console.log('\n🔍 CHARACTER ANALYSIS:');
console.log('Decline message special chars:', [...declineMessage].filter(char => char.charCodeAt(0) > 127));
console.log('Cancel message special chars:', [...cancelMessage].filter(char => char.charCodeAt(0) > 127));

// Check for line endings
console.log('\n📋 LINE ENDING ANALYSIS:');
console.log('Decline \\n count:', (declineMessage.match(/\n/g) || []).length);
console.log('Cancel \\n count:', (cancelMessage.match(/\n/g) || []).length);
console.log('Decline \\r count:', (declineMessage.match(/\r/g) || []).length);
console.log('Cancel \\r count:', (cancelMessage.match(/\r/g) || []).length);