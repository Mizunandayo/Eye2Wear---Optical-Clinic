
import BautistaInventoryProduct from "../models/bautistainventoryproduct.js";
import PatientWishlist from "../models/patientwishlist.js";
import PatientDemographic from "../models/patientdemographic.js";








    //Create Clinic BautistaInventoryProduct
    export const createbautistainventoryproduct = async (req, res) => {
        try{
            const newbautistainventoryproduct = new BautistaInventoryProduct(req.body);
            const savedbautistainventoryproduct = await newbautistainventoryproduct.save();
            res.status(201).json(savedbautistainventoryproduct);

        }catch(error){
            res.status(400).json({message: error.message});
        }
    };





    //Get All Clinic BautistaInventoryProduct
    export const getallbautistainventoryproduct = async (req, res) => {
        try{
            // Optimized query with field selection, lean(), and proper sorting
            const bautistainventoryproducts = await BautistaInventoryProduct.find({})
                .select('bautistainventoryproductid bautistainventoryproductcategory bautistainventoryproductname bautistainventoryproductbrand bautistainventoryproductmodelnumber bautistainventoryproductdescription bautistainventoryproductprice bautistainventoryproductquantity bautistainventoryproductimagepreviewimages bautistainventoryproductwishlistcount createdAt')
                .sort({bautistainventoryproductid: -1})
                .lean(); // Returns plain JavaScript objects for better performance
            
            res.json(bautistainventoryproducts);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };


    //Get Single Clinic BautistaInventoryProduct by ID
    export const getbautistainventoryproductbyid = async (req, res) => {
        try{
            const { id } = req.params;
            const bautistainventoryproduct = await BautistaInventoryProduct.findOne({ 
                bautistainventoryproductid: id 
            })
                .select('bautistainventoryproductid bautistainventoryproductcategory bautistainventoryproductname bautistainventoryproductbrand bautistainventoryproductmodelnumber bautistainventoryproductdescription bautistainventoryproductprice bautistainventoryproductquantity bautistainventoryproductimagepreviewimages bautistainventoryproductwishlistcount createdAt')
                .lean(); // Returns plain JavaScript objects for better performance
            
            if (!bautistainventoryproduct) {
                return res.status(404).json({message: "Bautista Inventory Product not found"});
            }
            
            res.json(bautistainventoryproduct);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };

     









    //AICODE//AICODE//AICODE//AICODE//AICODE
    //Update BautistaInventoryProduct Details

    
    export const updatebautistainventoryproductbyid = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // First, get the current product data to check for restocking
            const currentProduct = await BautistaInventoryProduct.findOne({ bautistainventoryproductid: id });
            
            if (!currentProduct) {
                return res.status(404).json({ message: "Bautista Inventory Product not found" });
            }

            // Check if this is a restock (quantity was 0 and now > 0)
            const wasOutOfStock = currentProduct.bautistainventoryproductquantity === 0;
            const isNowInStock = updateData.bautistainventoryproductquantity && updateData.bautistainventoryproductquantity > 0;
            const isRestocked = wasOutOfStock && isNowInStock;

            // Update the bautistainventoryproduct with new data
            const updatedbautistainventoryproduct = await BautistaInventoryProduct.findOneAndUpdate(
                { bautistainventoryproductid: id },
                updateData,
                { new: true }
            );

            // If product was restocked, send SMS notifications to wishlist customers
            if (isRestocked) {
                console.log(`🔄 Product restocked detected: ${updatedbautistainventoryproduct.bautistainventoryproductname}`);
                await sendWishlistRestockNotifications(updatedbautistainventoryproduct, 'bautista');
            }
        
            res.status(200).json(updatedbautistainventoryproduct);
        } catch (error) {
            console.error("Error updating Bautista Inventory Product:", error);
            res.status(500).json({ message: error.message });
        }
    };

    // Helper function to send SMS notifications for restocked wishlist items
    async function sendWishlistRestockNotifications(product, clinicType) {
        try {
            console.log(`📱 Checking for wishlist customers for product ID: ${product.bautistainventoryproductid}`);
            
            // Find all customers who have this product in their wishlist
            const wishlistCustomers = await PatientWishlist.find({
                patientwishlistinventoryproductid: product.bautistainventoryproductid,
                clinicType: clinicType
            });

            console.log(`👥 Found ${wishlistCustomers.length} customers with this product in their wishlist`);

            if (wishlistCustomers.length === 0) {
                console.log('📭 No customers found in wishlist for this product');
                return;
            }

            // Send SMS to each customer
            for (const wishlistItem of wishlistCustomers) {
                try {
                    // Get customer phone number from patient demographics
                    const patient = await PatientDemographic.findOne({
                        patientemail: wishlistItem.patientaccount
                    });

                    if (!patient || !patient.patientcontactnumber) {
                        console.warn(`⚠️ No phone number found for customer: ${wishlistItem.patientaccount}`);
                        continue;
                    }

                    // Send SMS notification
                    await sendRestockSMS(
                        patient.patientcontactnumber,
                        `${patient.patientfirstname} ${patient.patientlastname}`,
                        product,
                        clinicType
                    );

                    console.log(`📱 SMS sent to ${patient.patientfirstname} ${patient.patientlastname} (${patient.patientcontactnumber})`);

                } catch (smsError) {
                    console.error(`❌ Failed to send SMS to customer ${wishlistItem.patientaccount}:`, smsError);
                }
            }

        } catch (error) {
            console.error('❌ Error in sendWishlistRestockNotifications:', error);
        }
    }

    // Helper function to send individual restock SMS
    async function sendRestockSMS(phoneNumber, customerName, product, clinicType) {
        try {
            // Dynamic import to avoid circular dependencies
            const SmsController = (await import('./smsmessage.controller.js')).default;
            
            // Call the new restock notification method directly
            const result = await SmsController.sendRestockNotification(
                phoneNumber, 
                customerName, 
                product, 
                clinicType
            );
            
            console.log(`✅ Restock SMS sent successfully:`, result);
            return result;
            
        } catch (error) {
            console.error('❌ Failed to send restock SMS:', error);
            throw error;
        }
    }






    //Delete bautistainventoryproductId Details
    export const deletebautistainventoryproductbyid = async (req, res) => {
        try {
            const deletebautistainventoryproduct = await BautistaInventoryProduct.findOneAndDelete({ 
                bautistainventoryproductid: req.params.id 
            });
    
            if (!deletebautistainventoryproduct) return res.status(404).json({message: "Bautista Inventory Product not found"});
            res.json({message: "Bautista Inventory Product deleted successfully"});    
    
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    };





