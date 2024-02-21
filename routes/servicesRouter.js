import express from "express";
import {
  appointmentsController,
  deleteServicesController,
  getServicesController,
  postServicesController,
  updateServicesController,
} from "../controllers/servicesController.js";
import { selectedService } from "../controllers/paymentController.js";

const servicesRouter = express.Router();

servicesRouter.post("/postservices", postServicesController);
servicesRouter.put("/updateservice/:id", updateServicesController);
servicesRouter.get("/getservices", getServicesController);
servicesRouter.delete("/deleteservices", deleteServicesController);
servicesRouter.post("/appointment", appointmentsController);
servicesRouter.get("/selectedService/:id", selectedService);

export default servicesRouter;
