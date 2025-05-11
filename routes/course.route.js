import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();

//niche saare course ko post krne ka route hai
//pehle isAuthenticated run hoga fir createCourse function run hoga
router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get( getPublishedCourse);
//ek creator ka banaya hua saare course ko get krne ka route (logic in course.controller.js)
router.route("/").get(isAuthenticated,getCreatorCourses);
//ek course ko edit krne ka route (path ke saath hm courseId bhi pass kr rhe hai)
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
//ye course ke backend se data fetch krke frontend me dikhane ka path hai
router.route("/:courseId").get(isAuthenticated, getCourseById);
//coures ko create krne ka route by admin
//post use kr rhe hai kyuki course create ho rha hai (agar read krna hota to get use krte)
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
//course ko edit krne ke liye (:lectureId dynamic route hai uske liye hme controller me params ka use krna hota hai)
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

//patch hm tb use krte hai jb hme koi minor chiz update krni hoti hai

export default router;