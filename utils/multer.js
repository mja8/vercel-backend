//multer ko hm cloudinary setup krne ke liye use krenge
import multer from "multer";

//dest mtlb kha pe wo image save hogi wo
//is updloads folder ke andar jo bhi image hm store krenge wo ayengi
const upload = multer({dest:"uploads/"});
export default upload

//ab aage utils me cloudinary ko setup krenge