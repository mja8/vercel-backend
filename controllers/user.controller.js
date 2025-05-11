//esme hm business Logic likhenge ki user ko Register kaise karna hai
//{name, email, password} hm hmesha req.body se receive krte hai
//{!name || !email || !password} se agar koi field chut gya to error message bhejta hai
//yha pe User DB schema hai jo hmne models me create kiya tha
//findOne() sirf ek hi email id ko khojega, agar pehle se email exist hua to error gen hoga
//User.create me name, email, password hi dala tha kyoki sirf wohi required:true thi baaki sb required nhi thi
//ab hm password ko hash krenge using bcrypt fir store krenge
//bcrypt.hash(password, 10) me 10 salt round hota hai, if salt round increases then security increases but time also increase
//password:hashedPassword (ye object hai, Key:Value pair hai), name, email bhi key value pair hai but yha key aur value same hi hai
//201 code tb use hota hai jb kuch create hota hai


//ye business logic Register ke liye hai
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js"; //imported
export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message: "User already exist with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name, 
            email,
            password:hashedPassword
        });

        return res.status(201).json({
            success:true,
            message:"Account created successfully."
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}


//ab business logic login ke liye banega
//hmesha {email, password} req.body se request kiya jata hai
//bcrypt me password matching ke liye bcrypt.compare(password, user.password) hota hai


export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        //agar user hoga tbhi to login hoga (usi ka cond. check hai)
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        //JWT authentication ke liye hmlog ek alag file me Logic likhenge kyuki usse bar bar use kr paye
        //header me import bhi kiya hai
        //aur usko yha pe use kr liya hai
        generateToken(res, user, `Welcome back ${user.name}`);
         
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        });
    }
}

//logout logic (cookie ko clear krke)
//maxAge:0 mtlb turant expire ho jayega
export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}


//getUserProfile logic
export const getUserProfile = async (req,res) => {
    try {
        //req se jo id return hoga whi userId me save hoga
        const userId = req.id;
        //fir userId ko find krenge
        //password nhi chahiye(minus use kiye hai), enrolledCourses bhi chahiye(populate use kiya hai)
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        //agar user nhi mila to
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        //agar user mil gya to 
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}

//user ke profile ko update krne ke liye
export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name, role} = req.body; //role changes
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            });
        }
        //hm directly photo update nhi kr skte hai kyoki cloudinary me store hota hai
        //utils->multer.js use krenge hm destination folder me image store krne ke liye 
        //cloudinary ko hm utils->cloudinary.js me setup kiye hai

        // extract public id of the old image from the url if it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId); // delete old photo (nya photo add krne se pehle)
        }

        // upload new photo (cloud pe upload kro photo ko)
        const cloudResponse = await uploadMedia(profilePhoto.path);
        //aur uska secure url save kro photoUrl me
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl, role};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");//password nhi chahiye isliye minus

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}