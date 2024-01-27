import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewroute.js";
import servicesRouter from "./routes/servicesRouter.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();

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
app.use('/status', authRouter)

const PORT=process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})