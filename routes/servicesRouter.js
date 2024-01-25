import express from "express";
import { getServicesController, postServicesController } from "../controllers/servicesController.js";
const servicesRouter = express.Router();

servicesRouter.post("/postservices", postServicesController);
servicesRouter.get("/getservices", getServicesController);

export default servicesRouter;
