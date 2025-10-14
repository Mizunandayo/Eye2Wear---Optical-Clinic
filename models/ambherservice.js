import mongoose from "mongoose";

const AmbherserviceSchema = new mongoose.Schema(
  {
    ambherservicename: {
      type: String,
      required: true,
      trim: true
    },
    ambherservicedescription: {
      type: String,
      required: true,
      trim: true
    },
    ambherserviceprice: {
      type: Number,
      required: true,
      min: 0
    },
    ambherserviceisarchived: {
      type: Boolean,
      default: false
    },
    ambherserviceaddedby: {
      type: String,
      required: true
    },
    ambherserviceaddedbytype: {
      type: String,
      required: true
    },
    ambherserviceaddedbyfirstname: {
      type: String,
      required: true
    },
    ambherserviceaddedbylastname: {
      type: String,
      required: true
    },
    ambherserviceaddedbyprofilepicture: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Index for faster queries
AmbherserviceSchema.index({ ambherservicename: 1 });
AmbherserviceSchema.index({ ambherserviceisarchived: 1 });

const Ambherservice = mongoose.model("Ambherservice", AmbherserviceSchema);

export default Ambherservice;
