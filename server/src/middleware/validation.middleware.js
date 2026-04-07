// middleware/validation.middleware.js

import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);

      return next(
        new ApiError(400, "Validation error", errors)
      );
    }

    // ✅ assign cleaned data
    req[property] = value;

    next();
  };
};
            // new keyword jo h wo ApiError class ka instance create krta h aur uske constructor ko call krta h jisme humne statusCode, message, error pass kiya h jese ki 400, "validation error", error array jisme sare validation errors hote h to y new keywords jo h wo y h ki yeh ek naya object create karega jo ApiError class ka instance or intance ko ase smjho ki ek error object hoga jisme statusCode, message, error array hoga aur yeh object next function ko pass kiya jayega jisse ki yeh error handling middleware tak pahuch jayega aur waha se client ko response bheja jayega ki validation error hua h.
            //next functions h ya keyword h jo express.js me use hota h middleware functions me jisse ki hum next middleware function ko call kar sakte h ya error handling middleware ko call kar sakte h. jab bhi hum next function ko call karte h to yeh express.js ko batata h ki abhi ka middleware function khatam ho gaya h aur ab agla middleware function execute hona chahiye. agar hum next function ko kisi error object ke sath call karte h to yeh express.js ko batata h ki ek error hua h aur ab error handling middleware ko execute karna chahiye. is case me hum next(new ApiError(400, "validation error", error)) call kar rahe h jisme new ApiError(400, "validation error", error) ek naya error object create karega jisme statusCode 400, message "validation error" aur error array hoga jisme sare validation errors honge. is tarah se yeh error handling middleware tak pahuch jayega aur client ko response bheja jayega ki validation error hua h.