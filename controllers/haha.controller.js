  // Send appointment Cancellation SMS
  static async sendAppointmentCancellation(req, res) {
    try {
      const { appointmentId, clinicType } = req.body;

      if (!appointmentId || !clinicType) {
        return res.status(400).json({
          error: 'Appointment ID and clinic type are required'
        });
      }

      // Get appointment details by ObjectId
      const appointment = await PatientAppointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({
          error: 'Appointment not found'
        });
      }

      // Get patient demographic information using the appointment email
      const patient = await PatientDemographic.findOne({
        patientemail: appointment.patientappointmentemail
      });

      if (!patient || !patient.patientcontactnumber) {
        return res.status(400).json({
          error: 'Patient contact number not found'
        });
      }

      // Get clinic-specific details based on clinic type
      const isAmbher = clinicType.toLowerCase() === 'ambher';
      const clinicName = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
      const appointmentDate = isAmbher ? appointment.patientambherappointmentdate : appointment.patientbautistaappointmentdate;
      const appointmentTime = isAmbher ? appointment.patientambherappointmenttime : appointment.patientbautistaappointmenttime;
      const appointmentLocation = isAmbher ? appointment.patientambherappointmentlocationaddress : appointment.patientbautistaappointmentlocationaddress;
      const eyeSpecialist = isAmbher ? appointment.patientambherappointmenteyespecialist : appointment.patientbautistaappointmenteyespecialist;

      // Get clinic-specific iProg client for appointment Cancellation
      const clinicSmsClient = getClinicSMSClient(clinicName);
      console.log(`🏥 Using SMS client for appointment Cancellation - clinic: ${clinicName}`);

      // Create SMS message
      const message = `Appointment Cancelled

Dear ${patient.patientfirstname},

Great news! Your appointment request has been Cancelled.

Date: ${appointmentDate}
Time: ${appointmentTime}
Clinic: ${clinicName}
Location: ${appointmentLocation}
Eye Specialist: ${eyeSpecialist || 'To be assigned'}

Please arrive 15 minutes early for your appointment. Bring a valid ID and any previous eye examination records.

If you need to reschedule, please contact us immediately.

Thank you for choosing ${clinicName}!`;

      // Send SMS via iProg using bulk endpoint for consistency
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      // Enhanced credits tracking for appointment Cancellation SMS
      let creditsBeforeSending = null;
      let creditsAfterSending = null;
      let actualCreditsDeducted = 0;

      // Try multiple times to get accurate credits before sending
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`💳 Checking credits before sending appointment Cancellation SMS (attempt ${attempt})...`);
          const creditsBeforeResult = await clinicSmsClient.checkSmsCredits();
          if (creditsBeforeResult.success) {
            creditsBeforeSending = creditsBeforeResult.balance;
            console.log(`💳 Credits before sending (attempt ${attempt}): ${creditsBeforeSending}`);
            break; // Success, exit loop
          }
        } catch (error) {
          console.warn(`⚠️ Credits check attempt ${attempt} failed:`, error.message);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
          }
        }
      }

      const bulkSmsResult = await clinicSmsClient.sendBulkSMS([phoneNumber], message);

      // Enhanced credits check after sending with multiple attempts
      if (creditsBeforeSending !== null && bulkSmsResult.success) {
        console.log('💳 Starting post-SMS credits verification for appointment Cancellation...');
        
        // Try multiple times with increasing delays to get accurate post-SMS credits
        const delays = [3000, 5000, 8000]; // 3, 5, 8 seconds
        
        for (let attempt = 0; attempt < delays.length; attempt++) {
          try {
            console.log(`💳 Waiting ${delays[attempt]/1000} seconds for API balance update...`);
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            
            const creditsAfterResult = await clinicSmsClient.checkSmsCredits();
            if (creditsAfterResult.success) {
              const newCreditsAfter = creditsAfterResult.balance;
              const newActualDeducted = creditsBeforeSending - newCreditsAfter;
              
              console.log(`💳 Credits check attempt ${attempt + 1}:`);
              console.log(`   Before: ${creditsBeforeSending}`);
              console.log(`   After: ${newCreditsAfter}`);
              console.log(`   Calculated deduction: ${newActualDeducted}`);
              
              // If we get a reasonable deduction amount, use it
              if (newActualDeducted > 0 && newActualDeducted <= 5) { // Max 5 credits for single SMS
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`✅ Using credits deduction from attempt ${attempt + 1}: ${actualCreditsDeducted}`);
                break;
              } else if (attempt === delays.length - 1) {
                // Last attempt, use whatever we got
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`⚠️ Using final attempt result: ${actualCreditsDeducted}`);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Credits check after sending (attempt ${attempt + 1}) failed:`, error.message);
          }
        }
        
        // Final verification log
        if (actualCreditsDeducted > 0) {
          console.log(`🎯 FINAL CREDITS TRACKING RESULT for Appointment Cancellation SMS:`);
          console.log(`   📊 Recipients: 1`);
          console.log(`   💰 Credits Before: ${creditsBeforeSending}`);
          console.log(`   💰 Credits After: ${creditsAfterSending}`);
          console.log(`   🔥 ACTUAL Deducted: ${actualCreditsDeducted}`);
          console.log(`   📈 Rate per SMS: ${actualCreditsDeducted}`);
        }
      }
      
      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record - use original contact number to maintain consistency with patient data
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [patient.patientcontactnumber], // Use original contact number
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Cancellation',
        type: 'Appointment',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        smsCreditsDeducted: actualCreditsDeducted, // Enhanced credits tracking
        smsCreditsBalance: creditsAfterSending, // Enhanced credits tracking
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null
      });

      await smsRecord.save();

      res.status(200).json({
        success: smsResult.success,
        messageId: smsRecord.messageId,
        iprogMessageId: smsResult.messageId,
        status: smsResult.success ? 'sent' : 'failed',
        message: smsResult.success 
          ? 'Appointment Cancellation notification sent successfully via iProg'
          : `Failed to send appointment Cancellation notification: ${smsResult.error}`
      });

    } catch (error) {
      console.error('Error sending appointment Cancellation SMS:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Send appointment decline SMS
  static async sendAppointmentDecline(req, res) {
    try {
      const { appointmentId, clinicType } = req.body;

      if (!appointmentId || !clinicType) {
        return res.status(400).json({
          error: 'Appointment ID and clinic type are required'
        });
      }

      // Get appointment details by ObjectId
      const appointment = await PatientAppointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({
          error: 'Appointment not found'
        });
      }

      // Get clinic-specific details based on clinic type
      const isAmbher = clinicType.toLowerCase() === 'ambher';
      
      // FIX: Use clinic-specific email field for patient lookup (was using wrong field)
      const appointmentEmail = isAmbher ? 
        appointment.patientambherappointmentemail : 
        appointment.patientbautistaappointmentemail;

      console.log(`🔍 Decline SMS - Looking for patient with email: ${appointmentEmail}`);
      console.log(`🔍 Decline SMS - Clinic type: ${clinicType} (isAmbher: ${isAmbher})`);

      // Get patient demographic information using the clinic-specific appointment email
      const patient = await PatientDemographic.findOne({
        patientemail: appointmentEmail
      });

      console.log(`🔍 Decline SMS - Patient found: ${patient ? 'YES' : 'NO'}`);
      if (patient) {
        console.log(`🔍 Decline SMS - Patient name: ${patient.patientfirstname} ${patient.patientlastname}`);
        console.log(`🔍 Decline SMS - Patient contact: ${patient.patientcontactnumber}`);
      }

      if (!patient || !patient.patientcontactnumber) {
        console.log(`❌ Decline SMS - Patient lookup failed for email: ${appointmentEmail}`);
        return res.status(400).json({
          error: `Patient contact number not found for email: ${appointmentEmail}`
        });
      }

      const clinicName = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
      const appointmentDate = isAmbher ? appointment.patientambherappointmentdate : appointment.patientbautistaappointmentdate;
      const appointmentTime = isAmbher ? appointment.patientambherappointmenttime : appointment.patientbautistaappointmenttime;
      const appointmentLocation = isAmbher ? appointment.patientambherappointmentlocationaddress : appointment.patientbautistaappointmentlocationaddress;

      // Get clinic-specific iProg client for appointment decline
      const clinicSmsClient = getClinicSMSClient(clinicName);
      console.log(`🏥 Using SMS client for appointment decline - clinic: ${clinicName}`);

      // Create SMS message
      const message = `Appointment Declined

Dear ${patient.patientfirstname},

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

      // Send SMS via iProg using bulk endpoint for consistency
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      // Enhanced credits tracking for appointment decline SMS
      let creditsBeforeSending = null;
      let creditsAfterSending = null;
      let actualCreditsDeducted = 0;

      // Try multiple times to get accurate credits before sending
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`💳 Checking credits before sending appointment decline SMS (attempt ${attempt})...`);
          const creditsBeforeResult = await clinicSmsClient.checkSmsCredits();
          if (creditsBeforeResult.success) {
            creditsBeforeSending = creditsBeforeResult.balance;
            console.log(`💳 Credits before sending (attempt ${attempt}): ${creditsBeforeSending}`);
            break; // Success, exit loop
          }
        } catch (error) {
          console.warn(`⚠️ Credits check attempt ${attempt} failed:`, error.message);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
          }
        }
      }

      const bulkSmsResult = await clinicSmsClient.sendBulkSMS([phoneNumber], message);

      // Enhanced credits check after sending with multiple attempts
      if (creditsBeforeSending !== null && bulkSmsResult.success) {
        console.log('💳 Starting post-SMS credits verification for appointment decline...');
        
        // Try multiple times with increasing delays to get accurate post-SMS credits
        const delays = [3000, 5000, 8000]; // 3, 5, 8 seconds
        
        for (let attempt = 0; attempt < delays.length; attempt++) {
          try {
            console.log(`💳 Waiting ${delays[attempt]/1000} seconds for API balance update...`);
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            
            const creditsAfterResult = await clinicSmsClient.checkSmsCredits();
            if (creditsAfterResult.success) {
              const newCreditsAfter = creditsAfterResult.balance;
              const newActualDeducted = creditsBeforeSending - newCreditsAfter;
              
              console.log(`💳 Credits check attempt ${attempt + 1}:`);
              console.log(`   Before: ${creditsBeforeSending}`);
              console.log(`   After: ${newCreditsAfter}`);
              console.log(`   Calculated deduction: ${newActualDeducted}`);
              
              // If we get a reasonable deduction amount, use it
              if (newActualDeducted > 0 && newActualDeducted <= 5) { // Max 5 credits for single SMS
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`✅ Using credits deduction from attempt ${attempt + 1}: ${actualCreditsDeducted}`);
                break;
              } else if (attempt === delays.length - 1) {
                // Last attempt, use whatever we got
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`⚠️ Using final attempt result: ${actualCreditsDeducted}`);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Credits check after sending (attempt ${attempt + 1}) failed:`, error.message);
          }
        }
        
        // Final verification log
        if (actualCreditsDeducted > 0) {
          console.log(`🎯 FINAL CREDITS TRACKING RESULT for Appointment Decline SMS:`);
          console.log(`   📊 Recipients: 1`);
          console.log(`   💰 Credits Before: ${creditsBeforeSending}`);
          console.log(`   💰 Credits After: ${creditsAfterSending}`);
          console.log(`   🔥 ACTUAL Deducted: ${actualCreditsDeducted}`);
          console.log(`   📈 Rate per SMS: ${actualCreditsDeducted}`);
        }
      }
      
      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record - use original contact number to maintain consistency with patient data
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [patient.patientcontactnumber], // Use original contact number
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Decline',
        type: 'Appointment',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        smsCreditsDeducted: actualCreditsDeducted, // Enhanced credits tracking
        smsCreditsBalance: creditsAfterSending, // Enhanced credits tracking
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null
      });

      await smsRecord.save();

      res.status(200).json({
        success: smsResult.success,
        messageId: smsRecord.messageId,
        iprogMessageId: smsResult.messageId,
        status: smsResult.success ? 'sent' : 'failed',
        message: smsResult.success 
          ? 'Appointment decline notification sent successfully via iProg'
          : `Failed to send appointment decline notification: ${smsResult.error}`
      });

    } catch (error) {
      console.error('Error sending appointment decline SMS:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }


