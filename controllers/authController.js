import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

import appointmentModel from "../models/appointment.model.js";

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

export const appointmentStatus = async (req, res) => {
  try {
    const razorpayPaymentId = req.params.razorpayPaymentId; // Adjust the parameter name based on your actual implementation
    // Find the appointment based on the Razorpay payment ID
    console.log(razorpayPaymentId)
    const result = await appointmentModel.findOne({
      razorpay_payment_id: razorpayPaymentId,
    });

    if (result) {
      res.status(200).json({
        success: true,
        message: "Appointment found",
        result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
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
