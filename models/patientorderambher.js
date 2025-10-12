import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";



const PatientOrderAmbherSchema = new mongoose.Schema({

    //GENERAL ORDERING INFORMATION
    patientorderambherid: {type: Number, unique: true},
    patientorderambherstatus: {type: String, enum: ['Cancelled', 'Pending', 'Ready for Pickup', 'Completed'], default: 'Pending'},
    patientorderambherhistory: [{ 
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
    patientorderambherproductid: {type: Number, required: true},
    patientorderambherproductname: {type: String, required: true},
    patientorderambherproductbrand: {type: String, required: true},
    patientorderambherproductmodelnumber: {type: String, required: true},
    patientorderambherproductcategory:{type: String, required: true},
    // Product images - Cloudinary URLs
    patientorderambherproductimage: {type: [String], required: true},
    // Cloudinary public_ids for product images management
    patientorderambherproductimage_public_ids: {type: [String], default: []},
    patientorderambherproductprice: {type: Number, required: true},
    patientorderambherproductquantity: {type: Number, required: true, min: 1},
    patientorderambherproductsubtotal: {type: Number, required: true},
    patientorderambherproductdescription: {type: String, required: true},
    patientorderambherproductnotes: {type: String},


    //PAYMENT INFORMATION
    patientorderambhercustomfee: { type: Number, default: 0 }, // Clinic customization fee
    patientorderambherdiscount: { type: Number, default: 0 }, // Discount percentage (0-100)
    patientorderambherdiscountamount: { type: Number, default: 0 }, // Actual discount amount in currency
    patientorderambheramountpaid: { type: Number, default: 0 }, // Customer total paid amount
    patientorderambherremainingbalance: { type: Number, default: 0 },
    patientorderambheramountpaidchange: { type: Number, default: 0 },  // Computed from deducting overall total to total paid amount
    patientorderambherproducttotal: { type: Number, default: 0 },  // Subtotal + CustomizationFee - Discount
    patientorderambherproductpaymentmethod: {type: String, enum: ['Cash', 'Bank Transfer'], default: 'Cash'},
    // Payment history tracking - records all payments made
    patientorderambherpaymenthistory: [{
        amount: { type: Number, required: true }, // Payment amount
        paymentDate: { type: Date, default: Date.now }, // When payment was made
        paymentType: { type: String, enum: ['Initial Payment', 'Additional Payment'], default: 'Additional Payment' }, // Type of payment
        processedBy: String, // Admin who processed the payment
        paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer'], default: 'Cash' }, // Method used
        remarks: String // Optional notes about the payment
    }],
    // Payment receipt image - Cloudinary URL
    patientorderambherproductpaymentreceiptimage: String,
    // Cloudinary public_id for payment receipt image
    patientorderambherproductpaymentreceiptimage_public_id: { type: String, default: null },
    patientorderambherproductpaymentstatus: { 
        type: String, 
        enum: ['Fully Paid', 'Partially Paid'], 
        default: 'Partially Paid' 
    },  
    patientorderambherproductpaymenttransactionid: String,




    //PICKUP INFORMATION
    patientorderambherproductpickupstatus: { 
        type: String, 
        default: 'Later' 
    },
    patientorderambherproductchosenpickupdate: String,
    patientorderambherproductchosenpickuptime: String,
    patientorderambherproductchosenpickupplace: String,



    //AUTHORIZED PERSON
    patientorderambherproducauthorizedname: String,
    patientorderambherproducauthorizedtype: String,

    //TIMESTAMPS
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
     
});


PatientOrderAmbherSchema.plugin(AutoIncrement(mongoose),{
    inc_field: "patientorderambherid",
    id: "patient_order_ambher_seq",
    start_seq: true,
    disable_hooks: false
});

PatientOrderAmbherSchema.post('save', function(error, doc, next){
    if(error?.name === 'MongoServerError' && error?.code === 11000) {
        this.constructor.counterReset('patientorderambherid', (err) => {
            if(err) {
                console.error('Failed to reset id sequence: ', err);
                return next(err);
            }
            console.log('Reset patientorderambherid sequence due to id duplication');
            next(error);
        });

    }else{
        next(error);
    }
});

// Add indexes for better query performance
PatientOrderAmbherSchema.index({ patientorderambherid: -1 }); // Primary sorting
PatientOrderAmbherSchema.index({ patientemail: 1 }); // Email filtering
PatientOrderAmbherSchema.index({ patientorderambherstatus: 1 }); // Status filtering
PatientOrderAmbherSchema.index({ patientorderambherproductcategory: 1 }); // Category filtering
PatientOrderAmbherSchema.index({ patientorderambherproductpaymentstatus: 1 }); // Payment status filtering
PatientOrderAmbherSchema.index({ createdAt: -1 }); // Date sorting
PatientOrderAmbherSchema.index({ patientlastname: 1, patientfirstname: 1 }); // Name searches
PatientOrderAmbherSchema.index({ patientlastname: 'text', patientfirstname: 'text', patientemail: 'text', patientorderambherproductname: 'text' }); // Text search



export default mongoose.model("PatientOrderAmbher", PatientOrderAmbherSchema);