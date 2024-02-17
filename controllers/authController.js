import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import appointmentModel from "../models/appointment.model.js";
import otpGenerator from 'otp-generator';
// register user controller
export const registerController = async (req, res) => {
  try {
    const { firstname, lastname, email, password, mobile } = req.body;

    // Existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success:false, message: "User with this email already exists. Please login." });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      firstname,
      lastname,
      email,
      password: hashPassword,
      mobile
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

export const ForgetPassController = async (req, res) => {
  try {
    const { email } = req.body;
   
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false, alphabets: false });
  
    res.status(200).json({
      success:true,
      message:"code generated",
      otp
    })
  } catch (error) {
    console.log("Error in login Controller : ", error);
    res.status(500).json({
      success: false,
      message: "Unable to login user",
      error,
    });
  }
};

// Change password controller
export const changePasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new hashed password
    const salt = await bcrypt.genSalt();
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user document with new password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in changePasswordController: ", error);
    res.status(500).json({
      success: false,
      message: "Unable to change password",
      error,
    });
  }
};


export const appointmentStatus = async (req, res) => {
  try {
    const razorpayPaymentId = req.params.razorpayPaymentId; // Adjust the parameter name based on your actual implementation
    // Find the appointment based on the Razorpay payment ID
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
