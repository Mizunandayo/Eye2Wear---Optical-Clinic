import mongoose from "mongoose";

const BautistaserviceSchema = new mongoose.Schema(
  {
    bautistaservicename: {
      type: String,
      required: true,
      trim: true
    },
    bautistaservicedescription: {
      type: String,
      required: true,
      trim: true
    },
    bautistaserviceprice: {
      type: Number,
      required: true,
      min: 0
    },
    bautistaserviceisarchived: {
      type: Boolean,
      default: false
    },
    bautistaserviceaddedby: {
      type: String,
      required: true
    },
    bautistaserviceaddedbytype: {
      type: String,
      required: true
    },
    bautistaserviceaddedbyfirstname: {
      type: String,
      required: true
    },
    bautistaserviceaddedbylastname: {
      type: String,
      required: true
    },
    bautistaserviceaddedbyprofilepicture: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Index for faster queries
BautistaserviceSchema.index({ bautistaservicename: 1 });
BautistaserviceSchema.index({ bautistaserviceisarchived: 1 });

const Bautistaservice = mongoose.model("Bautistaservice", BautistaserviceSchema);

export default Bautistaservice;
