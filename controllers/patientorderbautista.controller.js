    // SMS cooldown tracking to prevent duplicates
let lastSmsTime = 0;

import PatientOrderBautista from '../models/patientorderbautista.js';
    import process from 'process';








    //Create Patient Bautista Order
export const createpatientorderbautista = async (req, res) => {
    try{
        const requiredpatientorderfields = [
      'patientprofilepicture', 'patientlastname', 'patientfirstname',
      'patientemail', 'patientcontactnumber', 'patientorderbautistaproductid',
      'patientorderbautistaproductname', 'patientorderbautistaproductprice',
      'patientorderbautistaproductquantity', 'patientorderbautistaproductchosenpickupdate','patientorderbautistaproductchosenpickupplace'
      ];

      const missingrequiredpatientorderfields = requiredpatientorderfields.filter(field => !req.body[field]);
      if(missingrequiredpatientorderfields.length > 0) {
        return res.status(400).json({
            succes: false,
            message: `Missing required fields: ${missingrequiredpatientorderfields.join(', ')}`
        });
 }

        // Process the request body to handle "Now" pickup date
        const orderData = { ...req.body };
        
        // If pickup date is "Now", replace it with current date in YYYY-MM-DD format
        if (orderData.patientorderbautistaproductchosenpickupdate === "Now") {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            orderData.patientorderbautistaproductchosenpickupdate = `${year}-${month}-${day}`;
        }

        const neworder = new PatientOrderBautista(orderData);
        const savedorder = await neworder.save();

        res.status(201).json({
            succes: true,
            data: savedorder
        });
     
    }catch(error){
        console.error('Order submission error: ', error);
    }
};



    //Get All Patient Bautista Orders
    export const getallpatientorderbautistas = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields, lean(), and proper sorting
            const patientorderbautistas = await PatientOrderBautista.find({})
                .select('patientorderbautistaid patientorderbautistastatus patientorderbautistahistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderbautistaproductid patientorderbautistaproductname patientorderbautistaproductbrand patientorderbautistaproductmodelnumber patientorderbautistaproductcategory patientorderbautistaproductimage patientorderbautistaproductprice patientorderbautistaproductquantity patientorderbautistaproductsubtotal patientorderbautistaproductdescription patientorderbautistaproductnotes patientorderbautistacustomfee patientorderbautistaamountpaid patientorderbautistaremainingbalance patientorderbautistaamountpaidchange patientorderbautistaproducttotal patientorderbautistaproductpaymentmethod patientorderbautistaproductpaymentreceiptimage patientorderbautistaproductpaymentstatus patientorderbautistaproductpaymenttransactionid patientorderbautistaproductpickupstatus patientorderbautistaproductchosenpickupdate patientorderbautistaproductchosenpickupplace patientorderbautistaproductchosenpickuptime patientorderbautistaproducauthorizedname patientorderbautistaproducauthorizedtype createdAt updatedAt')
                .sort({patientorderbautistaid: -1})
                .lean(); // Returns plain JavaScript objects for better performance
            
            res.json(patientorderbautistas);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };



    //Get Single Bautista Orders by Id
    export const getpatientorderbautistabyid = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields and lean()
            const patientorderbautista = await PatientOrderBautista.findOne({
                patientorderbautistaid: req.params.id
            })
            .select('patientorderbautistaid patientorderbautistastatus patientorderbautistahistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderbautistaproductid patientorderbautistaproductname patientorderbautistaproductbrand patientorderbautistaproductmodelnumber patientorderbautistaproductcategory patientorderbautistaproductimage patientorderbautistaproductprice patientorderbautistaproductquantity patientorderbautistaproductsubtotal patientorderbautistaproductdescription patientorderbautistaproductnotes patientorderbautistacustomfee patientorderbautistaamountpaid patientorderbautistaremainingbalance patientorderbautistaamountpaidchange patientorderbautistaproducttotal patientorderbautistaproductpaymentmethod patientorderbautistaproductpaymentreceiptimage patientorderbautistaproductpaymentstatus patientorderbautistaproductpaymenttransactionid patientorderbautistaproductpickupstatus patientorderbautistaproductchosenpickupdate patientorderbautistaproductchosenpickupplace patientorderbautistaproductchosenpickuptime patientorderbautistaproducauthorizedname patientorderbautistaproducauthorizedtype createdAt updatedAt')
            .lean(); // Returns plain JavaScript objects for better performance
            
            if(!patientorderbautista) return res.status(404).json({message: "Bautista Order not found"});
            res.json(patientorderbautista);
        
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };






    //Get Bautista Order By Email
    export const getorderbautistasbyemail = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields, lean(), and indexed email lookup
            const patientorderbautistasbyemail = await PatientOrderBautista.find({
                patientemail: req.params.email
            })
            .select('patientorderbautistaid patientorderbautistastatus patientorderbautistahistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderbautistaproductid patientorderbautistaproductname patientorderbautistaproductbrand patientorderbautistaproductmodelnumber patientorderbautistaproductcategory patientorderbautistaproductimage patientorderbautistaproductprice patientorderbautistaproductquantity patientorderbautistaproductsubtotal patientorderbautistaproductdescription patientorderbautistaproductnotes patientorderbautistacustomfee patientorderbautistaamountpaid patientorderbautistaremainingbalance patientorderbautistaamountpaidchange patientorderbautistaproducttotal patientorderbautistaproductpaymentmethod patientorderbautistaproductpaymentreceiptimage patientorderbautistaproductpaymentstatus patientorderbautistaproductpaymenttransactionid patientorderbautistaproductpickupstatus patientorderbautistaproductchosenpickupdate patientorderbautistaproductchosenpickupplace patientorderbautistaproductchosenpickuptime patientorderbautistaproducauthorizedname patientorderbautistaproducauthorizedtype createdAt updatedAt')
            .sort({patientorderbautistaid: -1})
            .lean(); // Returns plain JavaScript objects for better performance

            if(!patientorderbautistasbyemail || patientorderbautistasbyemail.length === 0){
                return res.status(404).json({message: "No orderbautistas found in this email"});  
            }

            res.json(patientorderbautistasbyemail);
        
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };








    //Update Bautista Order Details

    export const updateorderbautistabyid = async (req,res) => {
        try{
            const { id } = req.params;
            const updateData = { ...req.body };

            // If pickup date is being updated and is "Now", replace it with current date
            if (updateData.patientorderbautistaproductchosenpickupdate === "Now") {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                updateData.patientorderbautistaproductchosenpickupdate = `${year}-${month}-${day}`;
            }

            const orderbautista = await PatientOrderBautista.findOne({patientorderbautistaid: id});
            if(!orderbautista) {
                return res.status(404).json({message: "Bautista Order not found"});
            }

            // Store original status to check for changes
            const originalStatus = orderbautista.patientorderbautistastatus;

            // Handle status history if status is being updated
            if(updateData.patientorderbautistastatus) {
                if(!orderbautista.patientorderbautistahistory) {
                    orderbautista.patientorderbautistahistory = [];
                }
                orderbautista.patientorderbautistahistory.push({
                    status: updateData.patientorderbautistastatus,
                    changedAt: new Date(),
                    changedBy: updateData.changedBy || 'System' // Default to 'System' if not provided
                });
                
                // Update the history in the updateData
                updateData.patientorderbautistahistory = orderbautista.patientorderbautistahistory;
            }

            const updatedbautistaorder = await PatientOrderBautista.findOneAndUpdate(
                { patientorderbautistaid: id},
                updateData,
                { new: true}
            );

            // Send SMS notification for order status changes
            if (updateData.patientorderbautistastatus && updateData.patientorderbautistastatus !== originalStatus) {
                try {
                    console.log(`📱 Sending SMS for status change: ${originalStatus} -> ${updateData.patientorderbautistastatus}`);
                    
                    // Add delay to prevent duplicate SMS calls
                    const now = Date.now();
                    if (now - lastSmsTime < 5000) { // 5 second cooldown
                        console.warn('⚠️ SMS blocked due to recent SMS send, preventing duplicate');
                        return res.status(200).json(updatedbautistaorder);
                    }
                    lastSmsTime = now;
                    
                    // Send SMS notification asynchronously (don't wait for it)
                    sendOrderStatusSMS(updatedbautistaorder.patientorderbautistaid, 'bautista', updateData.patientorderbautistastatus);
                } catch (smsError) {
                    console.error('Error sending order status SMS:', smsError);
                    // Don't fail the order update if SMS fails
                }
            }

            res.status(200).json(updatedbautistaorder);
        } catch(error){
            console.error("Error updating orderbautista: ", error);
            res.status(500).json({message: error.message});
        }
    }

    // Helper function to send order status SMS
    async function sendOrderStatusSMS(orderId, orderType, newStatus) {
        try {
            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/sms/order-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    orderType: orderType,
                    newStatus: newStatus
                })
            });

            if (!response.ok) {
                throw new Error(`SMS API returned ${response.status}`);
            }

            console.log('Order status SMS sent successfully');
        } catch (error) {
            console.error('Failed to send order status SMS:', error);
        }
    }

  



    //Delete Bautista OrderId Details
    export const deleteorderbautistabyid = async (req,res) => {
        try{
            const deleteorderbautista = await PatientOrderBautista.findOneAndDelete({
                patientorderbautistaid: req.params.id
            });

            if(!deleteorderbautista) return res.status(404).json({message: "Bautista Order not found"});
            res.json({message: "Bautista Order deleted successfully"});

        }catch(error){
            res.status(500).json({message: error.message});
        }
    }






    //Get every bautistaproduct sold count by id
export const getbautistaproductsoldcountbyid = async (req, res) => {
  const productId = parseInt(req.params.productid);
  try {
    const soldOrders = await PatientOrderBautista.aggregate([
      {
        $match: {
          patientorderbautistaproductid: productId,
          patientorderbautistastatus: "Completed"
        }
      },
      {
        $group: {
          _id: "$patientorderbautistaproductid",
          totalSold: { $sum: "$patientorderbautistaproductquantity" }
        }
      }
    ]);

    const totalSold = soldOrders[0]?.totalSold || 0;

    res.json({ productid: productId, sold: totalSold });
  } catch (error) {
    console.error("Error fetching sold count: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update payment for Bautista order
export const updatePaymentBautista = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientorderbautistaamountpaid, patientorderbautistaamountpaidchange } = req.body;

    const order = await PatientOrderBautista.findOne({ patientorderbautistaid: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the payment fields
    const updatedOrder = await PatientOrderBautista.findOneAndUpdate(
      { patientorderbautistaid: id },
      {
        patientorderbautistaamountpaid: patientorderbautistaamountpaid,
        patientorderbautistaamountpaidchange: patientorderbautistaamountpaidchange,
        patientorderbautistaremainingbalance: order.patientorderbautistaproducttotal - patientorderbautistaamountpaid
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    console.error("Error updating payment: ", error);
    res.status(500).json({ message: error.message });
  }
};
