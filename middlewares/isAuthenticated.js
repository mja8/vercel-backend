//isAuthenticated middleware se ye pta chalega ki kya user Login hai ya nhi
//jaise agar instructor ko course banana hai to pehle instructor login hona chahiye

import jwt from "jsonwebtoken";

//isAuthenticated function jo true/false return krega (login / not login)
//ek tarike se uske pass permission hai ya nhi(wo kaam krne ka)
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    //agar token nhi hai to unauthorised user hai ye
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    //agar token hai to usko apne secret key se verify kro
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    //4:40:00
    req.id = decode.userId;
    //ye next user.route.js me next function getUserProfile() ko call krega
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;