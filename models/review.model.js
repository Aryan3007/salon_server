import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ratings: {
      type: String,
      // required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("ReviewModel", reviewSchema);