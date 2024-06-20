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
import axios from "axios";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

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
// app.get('/api/images', async (req, res) => {
//   try {
//     const cloudName = 'dla56tkbp'; // Replace with your Cloudinary cloud name
//     const apiKey = '494523572888789'; // Replace with your Cloudinary API key
//     const apiSecret = 'YPfjnQomZpbATQzbKW38P9kyLlc'; // Replace with your Cloudinary API secret

//     // Construct the URL for fetching images from Cloudinary
//     const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

//     // Fetch images from Cloudinary with max_results set to 100 (adjust as needed)
//     const response = await axios.get(url, {
//       auth: {
//         username: apiKey,
//         password: apiSecret
//       },
//       params: {
//         max_results: 100 // Adjust this value as needed
//       }
//     });

//     // Send the response data back to the client
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching images from Cloudinary:', error.message);
//     res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
//   }
// });


cloudinary.config({
  cloud_name: 'dla56tkbp', // Replace with your Cloudinary cloud name
  api_key: '494523572888789',       // Replace with your Cloudinary API key
  api_secret: 'YPfjnQomZpbATQzbKW38P9kyLlc'  // Replace with your Cloudinary API secret
});

const storage = multer.memoryStorage(); // Use memory storage

const upload = multer({ storage: storage });

// Endpoint to upload an image to the "makeup" folder
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'makeup' },
      (error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
          return res.status(500).json({ error: 'Failed to upload image' });
        }
        res.json({ imageUrl: result.secure_url });
      }
    );

    req.file.stream.pipe(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Endpoint to fetch images from the "makeup" folder
app.get('/api/images', async (req, res) => {
  try {
    const cloudName = 'dla56tkbp'; // Replace with your Cloudinary cloud name
    const apiKey = '494523572888789';       // Replace with your Cloudinary API key
    const apiSecret = 'YPfjnQomZpbATQzbKW38P9kyLlc'; // Replace with your Cloudinary API secret

    // Construct the URL for fetching images from Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;

    // Fetch images from Cloudinary with max_results set to 100 (adjust as needed)
    const response = await axios.get(url, {
      auth: {
        username: apiKey,
        password: apiSecret
      },
      params: {
        max_results: 100, // Adjust this value as needed
        prefix: 'makeup/' // Filter images by the "makeup" folder
      }
    });

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error.message);
    res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
  }
});








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
    const secret = "nssOinzZfTLajrmmZrur0ij7";
    const expected = crypto
      .createHmac("SHA256", secret)
      .update(body_data)
      .digest("hex");


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
