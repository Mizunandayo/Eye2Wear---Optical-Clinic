// SMS cooldown tracking to prevent duplicates
let lastSmsTime = 0;

import PatientOrderAmbher from '../models/patientorderambher.js';
import process from 'process';








//Create Patient Order Ambher
export const createpatientorderambher = async (req, res) => {
    try{
        const requiredpatientorderfields = [
      'patientprofilepicture', 'patientlastname', 'patientfirstname',
      'patientemail', 'patientcontactnumber', 'patientorderambherproductid',
      'patientorderambherproductname', 'patientorderambherproductprice',
      'patientorderambherproductquantity', 'patientorderambherproductchosenpickupdate','patientorderambherproductchosenpickupplace'
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
        if (orderData.patientorderambherproductchosenpickupdate === "Now") {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            orderData.patientorderambherproductchosenpickupdate = `${year}-${month}-${day}`;
        }

        const neworder = new PatientOrderAmbher(orderData);
        const savedorder = await neworder.save();

        res.status(201).json({
            succes: true,
            data: savedorder
        });
     
    }catch(error){
        console.error('Order submission error: ', error);
    }
};





    //Get All Patient Order Ambhers
    export const getallpatientorderambhers = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields, lean(), and proper sorting
            const patientorderambhers = await PatientOrderAmbher.find({})
                .select('patientorderambherid patientorderambherstatus patientorderambherhistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderambherproductid patientorderambherproductname patientorderambherproductbrand patientorderambherproductmodelnumber patientorderambherproductcategory patientorderambherproductimage patientorderambherproductprice patientorderambherproductquantity patientorderambherproductsubtotal patientorderambherproductdescription patientorderambherproductnotes patientorderambhercustomfee patientorderambheramountpaid patientorderambherremainingbalance patientorderambheramountpaidchange patientorderambherproducttotal patientorderambherproductpaymentmethod patientorderambherproductpaymentreceiptimage patientorderambherproductpaymentstatus patientorderambherproductpaymenttransactionid patientorderambherproductpickupstatus patientorderambherproductchosenpickupdate  patientorderambherproductchosenpickupplace patientorderambherproductchosenpickuptime patientorderambherproducauthorizedname patientorderambherproducauthorizedtype createdAt updatedAt')
                .sort({patientorderambherid: -1})
                .lean(); // Returns plain JavaScript objects for better performance
            
            res.json(patientorderambhers);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };



    //Get Single Order Ambhers by Id
    export const getpatientorderambherbyid = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields and lean()
            const patientorderambher = await PatientOrderAmbher.findOne({
                patientorderambherid: req.params.id
            })
            .select('patientorderambherid patientorderambherstatus patientorderambherhistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderambherproductid patientorderambherproductname patientorderambherproductbrand patientorderambherproductmodelnumber patientorderambherproductcategory patientorderambherproductimage patientorderambherproductprice patientorderambherproductquantity patientorderambherproductsubtotal patientorderambherproductdescription patientorderambherproductnotes patientorderambhercustomfee patientorderambheramountpaid patientorderambherremainingbalance patientorderambheramountpaidchange patientorderambherproducttotal patientorderambherproductpaymentmethod patientorderambherproductpaymentreceiptimage patientorderambherproductpaymentstatus patientorderambherproductpaymenttransactionid patientorderambherproductpickupstatus patientorderambherproductchosenpickupdate patientorderambherproductchosenpickupplace patientorderambherproductchosenpickuptime patientorderambherproducauthorizedname patientorderambherproducauthorizedtype createdAt updatedAt')
            .lean(); // Returns plain JavaScript objects for better performance
            
            if(!patientorderambher) return res.status(404).json({message: "Order Ambher not found"});
            res.json(patientorderambher);
        
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };






    //Get Order Ambher By Email
    export const getorderambhersbyemail = async (req, res) => {
        try{
            // Optimized query with ALL necessary fields, lean(), and indexed email lookup
            const patientorderambhersbyemail = await PatientOrderAmbher.find({
                patientemail: req.params.email
            })
            .select('patientorderambherid patientorderambherstatus patientorderambherhistory patientprofilepicture patientlastname patientfirstname patientmiddlename patientemail patientcontactnumber patientorderambherproductid patientorderambherproductname patientorderambherproductbrand patientorderambherproductmodelnumber patientorderambherproductcategory patientorderambherproductimage patientorderambherproductprice patientorderambherproductquantity patientorderambherproductsubtotal patientorderambherproductdescription patientorderambherproductnotes patientorderambhercustomfee patientorderambheramountpaid patientorderambherremainingbalance patientorderambheramountpaidchange patientorderambherproducttotal patientorderambherproductpaymentmethod patientorderambherproductpaymentreceiptimage patientorderambherproductpaymentstatus patientorderambherproductpaymenttransactionid patientorderambherproductpickupstatus patientorderambherproductchosenpickupdate patientorderambherproductchosenpickupplace patientorderambherproductchosenpickuptime patientorderambherproducauthorizedname patientorderambherproducauthorizedtype createdAt updatedAt')
            .sort({patientorderambherid: -1})
            .lean(); // Returns plain JavaScript objects for better performance

            if(!patientorderambhersbyemail || patientorderambhersbyemail.length === 0){
                return res.status(404).json({message: "No orderambhers found in this email"});  
            }

            res.json(patientorderambhersbyemail);
        
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };








    //Update Order Ambher Details

    export const updateorderambherbyid = async (req,res) => {
        try{
            const { id } = req.params;
            const updateData = { ...req.body };

            // If pickup date is being updated and is "Now", replace it with current date
            if (updateData.patientorderambherproductchosenpickupdate === "Now") {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                updateData.patientorderambherproductchosenpickupdate = `${year}-${month}-${day}`;
            }

            const orderambher = await PatientOrderAmbher.findOne({patientorderambherid: id});
            if(!orderambher) {
                return res.status(404).json({message: "Order Ambher not found"});
            }

            // Store original status to check for changes
            const originalStatus = orderambher.patientorderambherstatus;

            // Handle status history if status is being updated
            if(updateData.patientorderambherstatus) {
                if(!orderambher.patientorderambherhistory) {
                    orderambher.patientorderambherhistory = [];
                }
                orderambher.patientorderambherhistory.push({
                    status: updateData.patientorderambherstatus,
                    changedAt: new Date(),
                    changedBy: updateData.changedBy || 'System' // Default to 'System' if not provided
                });
                
                // Update the history in the updateData
                updateData.patientorderambherhistory = orderambher.patientorderambherhistory;
            }

            const updatedorderambher = await PatientOrderAmbher.findOneAndUpdate(
                { patientorderambherid: id},
                updateData,
                { new: true}
            );

            // Send SMS notification for order status changes
            if (updateData.patientorderambherstatus && updateData.patientorderambherstatus !== originalStatus) {
                try {
                    console.log(`📱 Sending SMS for status change: ${originalStatus} -> ${updateData.patientorderambherstatus}`);
                    
                    // Add delay to prevent duplicate SMS calls
                    const now = Date.now();
                    if (now - lastSmsTime < 5000) { // 5 second cooldown
                        console.warn('⚠️ SMS blocked due to recent SMS send, preventing duplicate');
                        return res.status(200).json(updatedorderambher);
                    }
                    lastSmsTime = now;
                    
                    // Send SMS notification asynchronously (don't wait for it)
                    sendOrderStatusSMS(updatedorderambher.patientorderambherid, 'ambher', updateData.patientorderambherstatus);
                } catch (smsError) {
                    console.error('Error sending order status SMS:', smsError);
                    // Don't fail the order update if SMS fails
                }
            }

            res.status(200).json(updatedorderambher);
        } catch(error){
            console.error("Error updating orderambher: ", error);
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

  



    //Delete Order AmbherId Details
    export const deleteorderambherbyid = async (req,res) => {
        try{
            const deleteorderambher = await PatientOrderAmbher.findOneAndDelete({
                patientorderambherid: req.params.id
            });

            if(!deleteorderambher) return res.status(404).json({message: "Order Ambher not found"});
            res.json({message: "Order Ambher deleted successfully"});

        }catch(error){
            res.status(500).json({message: error.message});
        }
    }








    //Get every ambherproduct sold count by id
export const getambherproductsoldcountbyid = async (req, res) => {
  const productId = parseInt(req.params.productid);
  try {
    const soldOrders = await PatientOrderAmbher.aggregate([
      {
        $match: {
          patientorderambherproductid: productId,
          patientorderambherstatus: "Completed"
        }
      },
      {
        $group: {
          _id: "$patientorderambherproductid",
          totalSold: { $sum: "$patientorderambherproductquantity" }
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

// Update payment for Ambher order
export const updatePaymentAmbher = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientorderambheramountpaid, patientorderambheramountpaidchange } = req.body;

    const order = await PatientOrderAmbher.findOne({ patientorderambherid: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the payment fields
    const updatedOrder = await PatientOrderAmbher.findOneAndUpdate(
      { patientorderambherid: id },
      {
        patientorderambheramountpaid: patientorderambheramountpaid,
        patientorderambheramountpaidchange: patientorderambheramountpaidchange,
        patientorderambherremainingbalance: order.patientorderambherproducttotal - patientorderambheramountpaid
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
