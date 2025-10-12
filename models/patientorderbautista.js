import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";


const PatientOrderBautistaSchema = new mongoose.Schema({

     //GENERAL ORDERING INFORMATION
    patientorderbautistaid: {type: Number, unique: true},
    patientorderbautistastatus: {type: String, enum: ['Cancelled', 'Pending', 'Ready for Pickup', 'Completed'], default: 'Pending'},
    patientorderbautistahistory: [{ 
    status: {type: String, enum: ['Cancelled', 'Pending', 'Ready for Pickup', 'Completed']},
    changedAt: {type: Date , default: Date.now},
    changedBy: String,
}],


    //PATIENT INFORMATION
    // Patient profile picture - Cloudinary URL
    patientprofilepicture: String,
    // Cloudinary public_id for patient profile picture
    patientprofilepicture_public_id: { type: String, default: null },
    patientlastname: {type: String, required: true},
    patientfirstname: {type: String, required: true},
    patientmiddlename: String,
    patientemail: {type: String, required: true},
    patientcontactnumber: {type: String, required: true},

    //PATIENT ORDERED PRODUCT INFORMATION
    patientorderbautistaproductid: {type: Number, required: true},
    patientorderbautistaproductname: {type: String, required: true},
    patientorderbautistaproductbrand: {type: String, required: true},
    patientorderbautistaproductmodelnumber: {type: String, required: true},
    patientorderbautistaproductcategory:{type: String, required: true},
    // Product images - Cloudinary URLs
    patientorderbautistaproductimage: {type: [String], required: true},
    // Cloudinary public_ids for product images management
    patientorderbautistaproductimage_public_ids: {type: [String], default: []},
    patientorderbautistaproductprice: {type: Number, required: true},
    patientorderbautistaproductquantity: {type: Number, required: true, min: 1},
    patientorderbautistaproductsubtotal: {type: Number, required: true},
    patientorderbautistaproductdescription: {type: String, required: true},
    patientorderbautistaproductnotes: {type: String},

    //PAYMENT INFORMATION
    patientorderbautistacustomfee: { type: Number, default: 0 }, // Clinic customization fee
    patientorderbautistadiscount: { type: Number, default: 0 }, // Discount percentage (0-100)
    patientorderbautistadiscountamount: { type: Number, default: 0 }, // Actual discount amount in currency
    patientorderbautistaamountpaid: { type: Number, default: 0 }, // Customer total paid amount
    patientorderbautistaremainingbalance: { type: Number, default: 0 },
    patientorderbautistaamountpaidchange: { type: Number, default: 0 }, // Computed from deducting overall total to total paid amount
    patientorderbautistaproducttotal: { type: Number, default: 0 },  // Subtotal + CustomizationFee - Discount
    patientorderbautistaproductpaymentmethod: {type: String, enum: ['Cash', 'Bank Transfer'], default: 'Cash'},
    // Payment history tracking - records all payments made
    patientorderbautistapaymenthistory: [{
        amount: { type: Number, required: true }, // Payment amount
        paymentDate: { type: Date, default: Date.now }, // When payment was made
        paymentType: { type: String, enum: ['Initial Payment', 'Additional Payment'], default: 'Additional Payment' }, // Type of payment
        processedBy: String, // Admin who processed the payment
        paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer'], default: 'Cash' }, // Method used
        remarks: String // Optional notes about the payment
    }],
    // Payment receipt image - Cloudinary URL
    patientorderbautistaproductpaymentreceiptimage: String,
    // Cloudinary public_id for payment receipt image
    patientorderbautistaproductpaymentreceiptimage_public_id: { type: String, default: null },
    patientorderbautistaproductpaymentstatus: { 
        type: String, 
        enum: ['Fully Paid', 'Partially Paid'], 
        default: 'Partially Paid' 
    },  
    patientorderbautistaproductpaymenttransactionid: String,




    //PICKUP INFORMATION
    patientorderbautistaproductpickupstatus: { 
        type: String, 
        default: 'Later' 
    },
    patientorderbautistaproductchosenpickupdate: String,
    patientorderbautistaproductchosenpickuptime: String,
    patientorderbautistaproductchosenpickupplace: String,

    

    //AUTHORIZED PERSON
    patientorderbautistaproducauthorizedname: String,
    patientorderbautistaproducauthorizedtype: String,

    //TIMESTAMPS
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
     
});


PatientOrderBautistaSchema.plugin(AutoIncrement(mongoose),{
    inc_field: "patientorderbautistaid",
    id: "patient_order_bautista_seq",
    start_seq: true,
    disable_hooks: false
});

PatientOrderBautistaSchema.post('save', function(error, doc, next){
    if(error?.name === 'MongoServerError' && error?.code === 11000) {
        this.constructor.counterReset('patientorderbautistaid', (err) => {
            if(err) {
                console.error('Failed to reset id sequence: ', err);
                return next(err);
            }
            console.log('Reset patientorderbautistaid sequence due to id duplication');
            next(error);
        });

    }else{
        next(error);
    }
});

// Add indexes for better query performance
PatientOrderBautistaSchema.index({ patientorderbautistaid: -1 }); // Primary sorting
PatientOrderBautistaSchema.index({ patientemail: 1 }); // Email filtering
PatientOrderBautistaSchema.index({ patientorderbautistastatus: 1 }); // Status filtering
PatientOrderBautistaSchema.index({ patientorderbautistaproductcategory: 1 }); // Category filtering
PatientOrderBautistaSchema.index({ patientorderbautistaproductpaymentstatus: 1 }); // Payment status filtering
PatientOrderBautistaSchema.index({ createdAt: -1 }); // Date sorting
PatientOrderBautistaSchema.index({ patientlastname: 1, patientfirstname: 1 }); // Name searches
PatientOrderBautistaSchema.index({ patientlastname: 'text', patientfirstname: 'text', patientemail: 'text', patientorderbautistaproductname: 'text' }); // Text search



export default mongoose.model("PatientOrderBautista", PatientOrderBautistaSchema);