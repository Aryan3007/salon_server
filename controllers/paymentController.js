import serviceModel from "../models/service.model.js";

// export const paymentsController = async (req, res) => {
//   try {
//     const { id } = req.query; 
//     console.log(id);

//     const selectedService = await serviceModel.findById(id);

//     if (!selectedService) {
//       return res.status(404).json({
//         success: false,
//         message: "Can't find service",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Service selected",
//         selectedService,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


export const paymentsController = async (req, res) => {
    try {
      let service = await serviceModel.findById(req.params.id);
      if (!service)
        return res
          .status(404)
          .send("The user with the provided ID was not found.");
      res.status(200).json({
        success:true,
        message:"routing to selected service page",
        service
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        succes: false,
        message: "unable to find user",
        error,
      });
    }
  };
  