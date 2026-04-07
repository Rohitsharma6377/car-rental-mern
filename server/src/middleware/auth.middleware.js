import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const protect = (req,res,next)=>{
    // Get the token from the Authorization header
    // The token is usually sent as "Bearer
    //here in the params here next is the next middleware function that will be called after this middleware function is executed. if the token is valid then we will call next() to pass the control in hindi labguage next jo h wo express.js me use hota h middleware functions me jisse ki hum next middleware function ko call kar sakte h ya error handling middleware ko call kar sakte h. jab bhi hum next function ko call karte h to yeh express.js ko batata h ki abhi ka middleware function khatam ho gaya h aur ab agla middleware function execute hona chahiye. agar hum next function ko kisi error object ke sath call karte h to yeh express.js ko batata h ki ek error hua h aur ab error handling middleware ko execute karna chahiye. is case me agar token valid hai to hum next() call karenge jisse ki control agle middleware function me chala jayega aur agar token invalid hai to hum next(new ApiError(401, "Unauthorized")) call karenge jisme new ApiError(401, "Unauthorized") ek naya error object create karega jisme statusCode 401 aur message "Unauthorized" hoga. is tarah se yeh error handling middleware tak pahuch jayega aur client ko response bheja jayega ki unauthorized access hua h.

    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
         return next(new ApiError(401, "Unauthorized"));
        }

        const token = authHeader.split("")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET ||"SECRET_KEY");
        req.user = decoded;

    } catch (error) {
        return next(new ApiError(401, "Unauthorized"));
    }
}

export const authorize = (...roles)=>{
    // here ... jo h spread operator h wo ek array ko individual elements me convert kar deta h jese ki agar hum authorize("admin", "vendor") call karte h to ...roles jo h wo ["admin", "vendor"] array ko individual elements me convert kar dega jese ki "admin", "vendor". is tarah se hum multiple roles ko authorize function me pass kar sakte h aur authorize function me hum check karenge ki req.user.role jo h wo in roles me se kisi ek ke barabar hai ya nahi. agar req.user.role in roles me se kisi ek ke barabar hai to hum next() call karenge jisse ki control agle middleware function me chala jayega aur agar req.user.role in roles me se kisi ek ke barabar nahi hai to hum next(new ApiError(403, "Forbidden")) call karenge jisme new ApiError(403, "Forbidden") ek naya error object create karega jisme statusCode 403 aur message "Forbidden" hoga. is tarah se yeh error handling middleware tak pahuch jayega aur client ko response bheja jayega ki forbidden access hua h.

    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return next(new ApiError(403, "Forbidden"));

        }
        next();
    }
}