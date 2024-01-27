import appointmentModel from "../models/appointment.model.js"
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

export const appointmentsController = async (req, res) => {
    try {
        const { name, email, mobile, address, dateTime, price } = req.body;
        const newAppointment = new appointmentModel({
            name,
            email,
            mobile,
            address,
            dateTime,
            price
        });

        await newAppointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment submitted",
            newAppointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error in appointment"
        });
    }
};

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
