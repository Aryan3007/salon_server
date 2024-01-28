import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewroute.js";
import servicesRouter from "./routes/servicesRouter.js";
import authRouter from "./routes/authRoute.js";
import Razorpay from "razorpay"
import appointmentModel from "./models/appointment.model.js";
import crypto from "crypto";
dotenv.config();


const razorpay=new Razorpay({
    key_id : process.env.RAZORPAY_ID_KEY,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})



const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//connect to database
const connectDB=async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongodb ${connect.connection.host}`)
    } catch (error) {
        console.log(`error in mongodb ${error}`)
    }
}
connectDB()


app.use('/review', reviewRouter)
app.use('/services', servicesRouter)
app.use('/auth', authRouter)


app.post('/payment/checkout', async(req, res)=>{
    try {
        const {name, email, mobile, dateTime,  address, amount} = req.body;
        const order = await razorpay.orders.create({
            amount: Math.max(parseFloat(amount), 100),
            currency:"INR"
        })

        

        await appointmentModel.create({
            order_id:order.id,
            name:name,
            amount: Math.max(parseFloat(amount), 100),
            email:email,
            mobile:mobile,
            date: dateTime,
            address:address
        })
        console.log({order})
        res.send(order)
       } catch (error) {
         console.log(error);
         res.status(404).json({
           succes: false,
           message: "unable to create order",
           error,
         });
       }
})


app.post('/payment/payment-verification', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        const body_data = `${razorpay_order_id}|${razorpay_payment_id}`;
        const secret = 'QPzP4H4lvI82qBzn6sqbQs6q';
        const expected = crypto.createHmac('SHA256', secret).update(body_data).digest("hex");

        console.log('Expected Signature:', expected);
        console.log('Received Signature:', razorpay_signature);

        if (expected === razorpay_signature) {
            await appointmentModel.findOneAndUpdate(
                { order_id: razorpay_order_id },
                {
                    $set: {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                    },
                }
            );

            res.status(200).json({
                success: true
            });
            return;
        } else {
            res.status(200).json({
                success: false
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Unable to verify payment",
            error,
        });
    }
});


const PORT=process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})