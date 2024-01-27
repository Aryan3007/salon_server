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
      dateTime: {
        type: String,
        required: true,
      },
    price:{
      type : Number ,
      required:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("AppointmentModel", appointmentSchema);