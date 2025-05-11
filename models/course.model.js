//is model ke hisab se course.controller.js bhi bnayenge controllers ke andar
import mongoose from "mongoose"

//niche schema hai course ko store krne ka
const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    //required true mtlb dena hi padega
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    //student ka Id bhi rakhna hai
    //user ka relationship bhi rakhna hai(using ref)
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User' //check iska kya mtlb hai 
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);