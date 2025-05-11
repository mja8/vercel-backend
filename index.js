// express ko import kiya
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

// call database connection here
connectDB();

// express ke andar jo bhi functionality thi wo app ke andar a gyi
const app = express();

const PORT = process.env.PORT || 3000;

// default Middleware 
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

// APIs here
app.use("/api/v1/media", mediaRoute); // mediaRoute ka Api
app.use("/api/v1/user", userRoute); // userRoute ka Api
app.use("/api/v1/course", courseRoute); // courseRoute ka Api
app.use("/api/v1/purchase", purchaseRoute); // purchaseRoute ka Api
app.use("/api/v1/progress", courseProgressRoute); // courseProgressRoute ka Api

// callback function port pe print krne ke liye
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
