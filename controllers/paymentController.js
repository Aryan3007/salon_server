import serviceModel from "../models/service.model.js";


export const selectedService = async (req, res) => {
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
  
export const checkoutController = async (req, res) => {
    try {
     const {name, email, mobile, dateTime,  address, amount} = req.body;
    } catch (error) {
      console.log(error);
      res.status(404).json({
        succes: false,
        message: "unable to find user",
        error,
      });
    }
  };
  