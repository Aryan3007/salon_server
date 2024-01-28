import express from "express";
import { loginUserController, paymentStatus, registerController } from "../controllers/authController.js";
import { allAppointmentsController } from "../controllers/servicesController.js";

const authRouter = express.Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginUserController)
authRouter.post('/test/:transactionId', paymentStatus)
authRouter.get('/allappointmnet', allAppointmentsController)

export default authRouter;
