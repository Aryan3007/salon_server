import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      // required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    order_id:{
      type:String
    },
    razorpay_payment_id:{
      type:String,
      default:null
    },
    razorpay_order_id:{
      type:String,
      default:null
    },
     razorpay_signature:{
      type:String,
      default:null
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("AppointmentModel", appointmentSchema);
