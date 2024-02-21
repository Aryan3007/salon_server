import express from "express";
import { deleteReviewController, getReviewController, postReviewController } from "../controllers/reviewController.js";
const reviewRouter = express.Router();

reviewRouter.post("/postreview", postReviewController);
reviewRouter.get("/getreview", getReviewController);
reviewRouter.delete("/deletereview", deleteReviewController);

export default reviewRouter;
