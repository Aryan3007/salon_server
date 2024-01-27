import express from "express";
import { appointmentsController, getServicesController, postServicesController } from "../controllers/servicesController.js";
import { paymentsController } from "../controllers/paymentController.js";
const servicesRouter = express.Router();

servicesRouter.post("/postservices", postServicesController);
servicesRouter.get("/getservices", getServicesController);
servicesRouter.post("/appointment", appointmentsController);
servicesRouter.get("/selectedService/:id", paymentsController);

export default servicesRouter;
