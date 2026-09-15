import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    courseInterest: {
      type: String,
      required: true,
      trim: true,
    },
    neetScore: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ email: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ courseInterest: 1 });

// Drop cached model in dev so schema edits apply after hot reload
if (process.env.NODE_ENV !== "production" && mongoose.models.Enquiry) {
  delete mongoose.models.Enquiry;
}

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
