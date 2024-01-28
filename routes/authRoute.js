import express from "express";
import { loginUserController, paymentStatus, registerController } from "../controllers/authController.js";
import { allAppointmentsController } from "../controllers/servicesController.js";
import { checkoutController } from "../controllers/paymentController.js";

const authRouter = express.Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginUserController)
authRouter.post('/test/:transactionId', paymentStatus)
authRouter.get('/allappointmnet', allAppointmentsController)
authRouter.get('/checkout', checkoutController)

export default authRouter;
