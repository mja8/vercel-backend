import jwt from "jsonwebtoken";

//jo bhi hm user.controller.js me bhej rhe the genToken function me wo sb yha pe hm receive kr lenge
export const generateToken = (res, user, message) => {
  //is jwt.sign me userId aur ek secret key dena hota hai, ye secret key hm env file me store kr lenge
  //expires in 1d mtlb ek din me expire ho jayega
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  //httpOnly is cross site security feature 
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day(1000 milisecond)
    }).json({
        success:true,
        message,
        user
    });
};
