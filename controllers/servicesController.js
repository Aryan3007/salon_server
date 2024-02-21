import appointmentModel from "../models/appointment.model.js"
// import reviewModel from "../models/review.model.js"
import serviceModel from "../models/service.model.js"
import userModel from "../models/user.model.js"

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
            message:"service submitted",
            newServices
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            messsage:"server error"
        })
    }
}

export const updateServicesController = async (req, res) => {
  try {
      const { id } = req.params; // Assuming the ID is passed in the URL params
      const { name, included, price } = req.body;

      // Check if the ID is provided
      if (!id) {
          return res.status(400).json({
              success: false,
              message: "ID parameter is required"
          });
      }

      // Find the service by ID and update it
      const updatedService = await serviceModel.findByIdAndUpdate(id, { name, included, price }, { new: true });

      // Check if the service exists
      if (!updatedService) {
          return res.status(404).json({
              success: false,
              message: "Service not found"
          });
      }

      res.status(200).json({
          success: true,
          message: "Service updated",
          data: updatedService
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Server error"
      });
  }
};


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


export const deleteServicesController = async (req, res) => {
    try {
        const { id } = req.body;
    
        // Find the service by ID and delete it
        const deletedService = await serviceModel.findByIdAndDelete(id);

        // Check if the service exists
        if (!deletedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted",
            data: deletedService // Optionally, you can send back the deleted service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const AppointmentsController = async (req, res) => {
    try {
      const { userId } = req.query;
  
      const user = await userModel.findById(userId).populate('appointments');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Filter appointments where razorpay_payment_id, razorpay_order_id, and razorpay_signature are not null
      const filteredAppointments = user.appointments.filter(
        (appointment) =>
          appointment.razorpay_payment_id !== null &&
          appointment.razorpay_order_id !== null &&
          appointment.razorpay_signature !== null
      );
  
      res.status(200).json({
        success: true,
        message: "Filtered Appointments found",
        appointments: filteredAppointments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error in appointments",
      });
    }
  };
  
  
  export const deleteAppointmentsController = async (req, res) => {
    try {
      const { userId } = req.query;
  
      const user = await userModel.findById(userId).populate('appointments');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Filter appointments with null values for razorpay_payment_id, razorpay_order_id, and razorpay_signature
      const appointmentsToDelete = user.appointments.filter(
        (appointment) =>
          appointment.razorpay_payment_id === null &&
          appointment.razorpay_order_id === null &&
          appointment.razorpay_signature === null
      );
  
      // Delete the filtered appointments
      await Promise.all(
        appointmentsToDelete.map(async (appointment) => {
          await appointmentModel.deleteOne({ _id: appointment._id });
        })
      );
  
      res.status(200).json({
        success: true,
        message: "Appointments with null values deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error in appointments",
      });
    }
  };
  