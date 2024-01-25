import reviewModel from "../models/review.model.js"
import serviceModel from "../models/service.model.js"

export const postServicesController = async(req, res)=>{
    try {
        const {name, included, price}=req.body
        const newServices= new serviceModel({
            name,
            price,
            included
        })
        await newServices.save()
        res.status(200).json({
            success:true,
            message:"review submitted",
            newServices
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            messsage:"server error"
        })
    }
}
export const getServicesController = async (req, res) => {
    try {
        const allServices = await serviceModel.find({});

        res.status(200).json({
            success: true,
            message: "All services found",
            allServices
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
