    import PatientAppointment from "../models/patientappointment.js";
    import ClinicLocation from "../models/cliniclocation.js";
    import process from 'process';








    //Create Patient Appointment
    export const createpatientappointment = async (req, res) => {
        try{
            // Validate clinic locations if provided
            const { patientambherappointmentlocation, patientbautistaappointmentlocation } = req.body;
            
            if (patientambherappointmentlocation) {
                const ambherLocation = await ClinicLocation.findOne({ 
                    clinicId: patientambherappointmentlocation, 
                    clinicType: 'Ambher Optical',
                    isActive: true 
                });
                if (!ambherLocation) {
                    return res.status(400).json({
                        message: 'Invalid Ambher Optical clinic location selected'
                    });
                }
            }
            
            if (patientbautistaappointmentlocation) {
                const bautistaLocation = await ClinicLocation.findOne({ 
                    clinicId: patientbautistaappointmentlocation, 
                    clinicType: 'Bautista Eye Center',
                    isActive: true 
                });
                if (!bautistaLocation) {
                    return res.status(400).json({
                        message: 'Invalid Bautista Eye Center clinic location selected'
                    });
                }
            }

            const newpatientappointment = new PatientAppointment(req.body);
            const savedpatientappointment = await newpatientappointment.save();
            res.status(201).json(savedpatientappointment);

        }catch(error){
            res.status(400).json({message: error.message});
        }
    };





    //Get All Patient Appointments
    export const getallpatientappointments = async (req, res) => {
        try{
            // Optimized query with lean() and field selection for better performance
            const patientappointments = await PatientAppointment.find()
                .select('patientappointmentid patientappointmentprofilepicture patientappointmentfirstname patientappointmentlastname patientappointmentemail patientappointmentstatus patientambherappointmentdate patientambherappointmenttime patientambherappointmentstatus patientambherappointmentpaymentotal patientbautistaappointmentdate patientbautistaappointmenttime patientbautistaappointmentstatus patientbautistaappointmentpaymentotal createdAt updatedAt')
                .sort({patientappointmentid: -1})
                .lean(); // Returns plain JavaScript objects instead of Mongoose documents
            
            res.json(patientappointments);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };



    //Get Single Appointments by Id
    export const getpatientappointmentbyid = async (req, res) => {
        try{    
            const patientappointment = await PatientAppointment.findOne({patientappointmentid: req.params.id});
            
            if(!patientappointment) return res.status(404).json({message: "Appointment not found"});
            res.json(patientappointment);
        
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };






    //Get Appointment By Email
    export const getappointmentsbyemail = async (req, res) => {
        try{
            // Optimized query with lean() for better performance
            const patientappointmentsbyemail = await PatientAppointment.find({
                patientappointmentemail: req.params.email
            })
            .sort({patientappointmentid: -1})
            .lean(); // Returns plain JavaScript objects instead of Mongoose documents

            // Return empty array instead of 404 when no appointments found
            // This prevents unnecessary error handling in the frontend
            res.json(patientappointmentsbyemail || []);
        

        }catch(error){
            res.status(500).json({message: error.message});
        }
    };






        // Get Ambher appointments by date and time
        export const getambherappointmentsbydatetime = async (req, res) => {
          try {
            const appointments = await PatientAppointment.find({
              patientambherappointmentdate: req.params.date,
              patientambherappointmenttime: req.params.time,
              patientambherappointmentstatus: { $in: ['Pending', 'Accepted'] }
            });


            res.json(appointments);


          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        };

        
        // Get Bautista appointments by date and time
        export const getbautistaappointmentsbydatetime = async (req, res) => {
          try {
            const appointments = await PatientAppointment.find({
               patientbautistaappointmentdate: req.params.date,
               patientbautistaappointmenttime: req.params.time,
               patientbautistaappointmentstatus: { $in: ['Pending', 'Accepted'] }
            });


            res.json(appointments);


          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        };

























    //Update Appointment Details

    export const updateappointmentbyid = async (req,res) => {
        try{
            const { id } = req.params;
            const updateData = req.body;

            const appointment = await PatientAppointment.findOne({patientappointmentid: id});
            if(!appointment) {
                return res.status(404).json({message: "Appointment not found"});
            }

            // Store original status to check for changes
            const originalAmbherStatus = appointment.patientambherappointmentstatus;
            const originalBautistaStatus = appointment.patientbautistaappointmentstatus;

            // Handle Ambher appointment status history
            if(updateData.patientambherappointmentstatus) {
                if(!appointment.patientambherappointmentstatushistory) {
                    appointment.patientambherappointmentstatushistory = [];
                }
                appointment.patientambherappointmentstatushistory.push({
                    status: updateData.patientambherappointmentstatus,
                    changedAt: new Date(),
                    changedBy: updateData.patientambherappointmentstatushistory?.changedBy || 'Unknown'
                });
            }

            // Handle Bautista appointment status history
            if(updateData.patientbautistaappointmentstatus) {
                if(!appointment.patientbautistaappointmentstatushistory) {
                    appointment.patientbautistaappointmentstatushistory = [];
                }
                appointment.patientbautistaappointmentstatushistory.push({
                    status: updateData.patientbautistaappointmentstatus,
                    changedAt: new Date(),
                    changedBy: updateData.patientbautistaappointmentstatushistory?.changedBy || 'Unknown'
                });
            }

            const updatedAppointment = await PatientAppointment.findOneAndUpdate(
                { patientappointmentid: id},
                updateData,
                { new: true}
            );

            // Send SMS notification for appointment confirmation
            const shouldSendSMS = (
                (updateData.patientambherappointmentstatus === 'Confirmed' && originalAmbherStatus !== 'Confirmed') ||
                (updateData.patientbautistaappointmentstatus === 'Confirmed' && originalBautistaStatus !== 'Confirmed')
            );

            if (shouldSendSMS) {
                try {
                    // Send SMS notification asynchronously (don't wait for it)
                    sendAppointmentConfirmationSMS(updatedAppointment._id);
                } catch (smsError) {
                    console.error('Error sending appointment confirmation SMS:', smsError);
                    // Don't fail the appointment update if SMS fails
                }
            }

            res.status(200).json(updatedAppointment);
        } catch(error){
            console.error("Error updating appointment: ", error);
            res.status(500).json({message: error.message});
        }
    }

    // Helper function to send appointment confirmation SMS
    async function sendAppointmentConfirmationSMS(appointmentId) {
        try {
            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/sms/appointment-reminder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appointmentId: appointmentId
                })
            });

            if (!response.ok) {
                throw new Error(`SMS API returned ${response.status}`);
            }

            console.log('Appointment confirmation SMS sent successfully');
        } catch (error) {
            console.error('Failed to send appointment confirmation SMS:', error);
        }
    }

  



    //Delete AppointmentId Details
    export const deleteappointmentbyid = async (req,res) => {
        try{
            const deleteappointment = await PatientAppointment.findOneAndDelete({
                patientappointmentid: req.params.id
            });

            if(!deleteappointment) return res.status(404).json({message: "Appointment not found"});
            res.json({message: "Appointment deleted successfully"});

        }catch(error){
            res.status(500).json({message: error.message});
        }
    }



















