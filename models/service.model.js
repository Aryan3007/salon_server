import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    included: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceModel", serviceSchema);
