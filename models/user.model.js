import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    appointments: {
      type: [mongoose.Types.ObjectId],
      ref: "AppointmentModel",
    }
  },
  { timestamps: true }
);

export default mongoose.model("UserModel", userSchema);
