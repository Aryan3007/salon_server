import express from "express";
import { loginUserController, paymentStatus, registerController } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginUserController)
authRouter.post('/test/:transactionId', paymentStatus)

export default authRouter;
