import express from "express";
import { ForgetPassController, appointmentStatus, changePasswordController, loginUserController, registerController } from "../controllers/authController.js";
import { AppointmentsController, deleteAppointmentsController } from "../controllers/servicesController.js";
import { checkoutController } from "../controllers/paymentController.js";

const authRouter = express.Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginUserController)
authRouter.post('/forgetpass', ForgetPassController)
authRouter.post('/setnewPassword', changePasswordController)
authRouter.get('/appointment/:razorpayPaymentId', appointmentStatus)
authRouter.get('/allappointmnet', AppointmentsController)
authRouter.delete('/deleteAppointmnet', deleteAppointmentsController)
authRouter.get('/checkout', checkoutController)
export default authRouter;
