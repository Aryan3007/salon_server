import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import sha256 from "crypto-js/sha256.js";
import axios from "axios"

// register user controller
export const registerController = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists. Please login." });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      firstname,
      lastname,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      newUser,
    });
  } catch (error) {
    console.log("Error in Register Controller: ", error);
    res.status(500).json({
      success: false,
      message: "Unable to register user",
      error,
    });
  }
};

//login user

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }
    //checking the validity of the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //create and provide a token
    let accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      user,
      message: "Logged In Successfully!",
      token: accessToken,
    });
  } catch (error) {
    console.log("Error in login Controller : ", error);
    res.status(500).json({
      success: false,
      message: "unable to login user",
      error,
    });
  }
};

export const paymentStatus = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const status = data.code;
    const merchantId = data.merchantId;
    const transactionId = data.transactionId;

    console.log(status);
    console.log(merchantId);
    console.log(transactionId);

    const st =
      `/pg/v1/status/${merchantId}/${transactionId}` +
      process.env.VITE_REACT_APP_SALT_KEY;
    // console.log(st)
    const dataSha256 = sha256(st);

    const checksum =
      dataSha256 + "###" + process.env.VITE_REACT_APP_SALT_INDEX;
    console.log(checksum);

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };

    // CHECK PAYMENT STATUS
    const response = await axios.request(options);
    console.log("r===", response.data.code);

    if (response.data.code === "PAYMENT_SUCCESS") {
      // Payment successful, send success response to client
      res.status(200).json({
        success: true,
        message: "Payment Successful",
        redirectUrlscc: "https://salon-client-ten.vercel.app/appointment",
      });
    } else {
      // Payment failed, send failure response to client
      res.status(200).json({
        success: false,
        message: "Payment Failed",
        redirectUrlfail: "https://salon-client-ten.vercel.app/failure",
      });
    }
  } catch (error) {
    console.log("Error in payment status: ", error);
    res.status(500).json({
      success: false,
      message: "Unable to check status",
      error,
    });
  }
};
