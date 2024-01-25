import reviewModel from "../models/review.model.js"

export const postReviewController = async(req, res)=>{
    try {
        const {name, ratings, message}=req.body
        const newReview= new reviewModel({
            name,
            message,
            ratings
        })
        await newReview.save()
        res.status(200).json({
            success:true,
            message:"review submitted",
            newReview
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            messsage:"server error"
        })
    }
}
export const getReviewController = async(req, res)=>{
    try {
        const reviews =  await reviewModel.find({})
        
        res.status(200).json({
            success:true,
            message:"review submitted",
            reviews
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            messsage:"server error in reviews"
        })
    }
}