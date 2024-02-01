import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewroute.js";
import servicesRouter from "./routes/servicesRouter.js";
import authRouter from "./routes/authRoute.js";
import Razorpay from "razorpay";
import appointmentModel from "./models/appointment.model.js";
import crypto from "crypto";
import userModel from "./models/user.model.js";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//connect to database
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to mongodb ${connect.connection.host}`);
  } catch (error) {
    console.log(`error in mongodb ${error}`);
  }
};
connectDB();

app.use("/review", reviewRouter);
app.use("/services", servicesRouter);
app.use("/auth", authRouter);
app.use("/status", authRouter);

app.post("/payment/checkout", async (req, res) => {
    try {
      const { name, email, mobile, date, address, amount, userId } = req.body;
  
      // Create the order
      const order = await razorpay.orders.create({
        amount: Math.max(parseFloat(amount * 100), 100),
        currency: "INR",
      });
  
      // Create the appointment
      const appointment = await appointmentModel.create({
        order_id: order.id,
        name: name,
        amount: Math.max(parseFloat(amount), 100),
        email: email,
        mobile: mobile,
        date: date,
        address: address,
      });
  
      // Update the user with the appointment
      await userModel.findByIdAndUpdate(userId, {
        $push: { appointments: appointment._id },
      });
  
      console.log({ order });
      res.send(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Unable to create order",
        error,
      });
    }
  });
  

app.post("/payment/payment-verification", async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      // If any of the required parameters is null, delete the appointment
      return res.status(400).json({
        success: false,
        message: "Invalid payment verification parameters",
      });
    }

    const body_data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const secret = "QPzP4H4lvI82qBzn6sqbQs6q";
    const expected = crypto
      .createHmac("SHA256", secret)
      .update(body_data)
      .digest("hex");

    console.log("Expected Signature:", expected);
    console.log("Received Signature:", razorpay_signature);

    if (expected === razorpay_signature) {
      await appointmentModel.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          $set: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
        }
      );

      res.status(200).json({
        success: true,
        message:" your payment has been successfully done, If you are not redirected go back to home page"
      });
      return;
    } else {
      // If the signature does not match, delete the appointment
      await appointmentModel.findOneAndDelete({ order_id: razorpay_order_id });

      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to verify payment",
      error,
    });
  }
});



const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
