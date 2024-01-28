import express from "express";
import { appointmentsController, getServicesController, postServicesController } from "../controllers/servicesController.js";
import { selectedService } from "../controllers/paymentController.js";
const servicesRouter = express.Router();

servicesRouter.post("/postservices", postServicesController);
servicesRouter.get("/getservices", getServicesController);
servicesRouter.post("/appointment", appointmentsController);
servicesRouter.get("/selectedService/:id", selectedService);

export default servicesRouter;
