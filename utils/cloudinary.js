//cloudinary ke server pe hm code milega ki usko kaise use krna hai

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

//ye teen keys hme env me store krke rakhna hai
//ye sb api key hme cloudinary ke site pe milenge [view API keys krke] 
//ye sb keys hm .env se import kr rhe hai
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});


//ye function cloudinary me image upload krne ke liye hai (video + photo both)
export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto", //ya to video hoga ya photo
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

//nya photo upload krte samay purane photo ko delete bhi krna hai
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

//ye video ko delete krne ke liye hai
export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
        console.log(error);
        
    }
}
