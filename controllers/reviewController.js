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
export const deleteReviewController = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID parameter is required"
            });
        }

        // Find the review by ID and delete it
        const deletedReview = await reviewModel.findByIdAndDelete(id);

        // Check if the review exists
        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted",
            data: deletedReview // Optionally, you can send back the deleted review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


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