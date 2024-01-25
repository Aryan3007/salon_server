import express from "express";
import { getReviewController, postReviewController } from "../controllers/reviewController.js";
const reviewRouter = express.Router();

reviewRouter.post("/postreview", postReviewController);
reviewRouter.get("/getreview", getReviewController);

export default reviewRouter;
