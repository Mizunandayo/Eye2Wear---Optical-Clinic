
import AmbherInventoryProduct from "../models/ambherinventoryproduct.js";
import PatientWishlist from "../models/patientwishlist.js";
import PatientDemographic from "../models/patientdemographic.js";








    //Create Clinic AmbherInventoryProduct
    export const createambherinventoryproduct = async (req, res) => {
        try{
            const newambherinventoryproduct = new AmbherInventoryProduct(req.body);
            const savedambherinventoryproduct = await newambherinventoryproduct.save();
            res.status(201).json(savedambherinventoryproduct);

        }catch(error){
            res.status(400).json({message: error.message});
        }
    };





    //Get All Clinic AmbherInventoryProduct
    export const getallambherinventoryproduct = async (req, res) => {
        try{
            // Optimized query with field selection, lean(), and proper sorting
            const ambherinventoryproducts = await AmbherInventoryProduct.find({})
                .select('ambherinventoryproductid ambherinventoryproductcategory ambherinventoryproductname ambherinventoryproductbrand ambherinventoryproductmodelnumber ambherinventoryproductdescription ambherinventoryproductprice ambherinventoryproductquantity ambherinventoryproductimagepreviewimages ambherinventoryproductwishlistcount createdAt')
                .sort({ambherinventoryproductid: -1})
                .lean(); // Returns plain JavaScript objects for better performance
            
            res.json(ambherinventoryproducts);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };


    //Get Single Clinic AmbherInventoryProduct by ID
    export const getambherinventoryproductbyid = async (req, res) => {
        try{
            const { id } = req.params;
            const ambherinventoryproduct = await AmbherInventoryProduct.findOne({ 
                ambherinventoryproductid: id 
            })
                .select('ambherinventoryproductid ambherinventoryproductcategory ambherinventoryproductname ambherinventoryproductbrand ambherinventoryproductmodelnumber ambherinventoryproductdescription ambherinventoryproductprice ambherinventoryproductquantity ambherinventoryproductimagepreviewimages ambherinventoryproductwishlistcount createdAt')
                .lean();
            
            if (!ambherinventoryproduct) {
                return res.status(404).json({message: "Ambher Inventory Product not found"});
            }
            
            res.json(ambherinventoryproduct);
    
        }catch(error){
            res.status(500).json({message: error.message});
        }
    };

     









    //AICODE//AICODE//AICODE//AICODE//AICODE
    //Update AmbherInventoryProduct Details

    
    export const updateambherinventoryproductbyid = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // First, get the current product data to check for restocking
            const currentProduct = await AmbherInventoryProduct.findOne({ ambherinventoryproductid: id });
            
            if (!currentProduct) {
                return res.status(404).json({ message: "Ambher Inventory Product not found" });
            }

            // Check if this is a restock (quantity was 0 and now > 0)
            const wasOutOfStock = currentProduct.ambherinventoryproductquantity === 0;
            const isNowInStock = updateData.ambherinventoryproductquantity && updateData.ambherinventoryproductquantity > 0;
            const isRestocked = wasOutOfStock && isNowInStock;

            // Update the ambherinventoryproduct with new data
            const updatedambherinventoryproduct = await AmbherInventoryProduct.findOneAndUpdate(
                { ambherinventoryproductid: id },
                updateData,
                { new: true }
            );

            // If product was restocked, send SMS notifications to wishlist customers
            if (isRestocked) {
                console.log(`🔄 Product restocked detected: ${updatedambherinventoryproduct.ambherinventoryproductname}`);
                await sendWishlistRestockNotifications(updatedambherinventoryproduct, 'ambher');
            }
        
            res.status(200).json(updatedambherinventoryproduct);
        } catch (error) {
            console.error("Error updating Ambher Inventory Product:", error);
            res.status(500).json({ message: error.message });
        }
    };

    // Helper function to send SMS notifications for restocked wishlist items
    async function sendWishlistRestockNotifications(product, clinicType) {
        try {
            console.log(`📱 Checking for wishlist customers for product ID: ${product.ambherinventoryproductid}`);
            
            // Find all customers who have this product in their wishlist
            const wishlistCustomers = await PatientWishlist.find({
                patientwishlistinventoryproductid: product.ambherinventoryproductid,
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






    //Delete ambherinventoryproductId Details
    export const deleteambherinventoryproductbyid = async (req, res) => {
        try {
            const deleteambherinventoryproduct = await AmbherInventoryProduct.findOneAndDelete({ 
                ambherinventoryproductid: req.params.id 
            });
    
            if (!deleteambherinventoryproduct) return res.status(404).json({message: "Ambher Inventory Product not found"});
            res.json({message: "Ambher Inventory Product deleted successfully"});    
    
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    };





