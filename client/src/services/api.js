import axios from "axios";
const API_URL = "http://localhost:5001/api";


export const api = axios.create({
    baseURL: API_URL,
// axios ka use karne ka fayda ye h ki hum apne API calls ko centralize kar sakte h aur agar hume apne API URL me koi change karna ho to hume sirf yaha par change karna hoga. iske alawa hum apne API calls ke liye common headers ya interceptors bhi yaha par define kar sakte h jisse ki hum apne API calls ko aur bhi efficient bana sakte h.

//interceptor y hota h ki jab bhi hum apne API calls karte h to hum apne request ya response me kuch changes kar sakte h jaise ki hum apne request me authorization header add kar sakte h jisme hum apne token ko send kar sakte h jisse ki hum apne protected routes ko access kar sakte h. iske alawa hum apne response me bhi kuch changes kar sakte h jaise ki agar hume apne response me error handling karni ho to hum apne interceptor me error handling logic likh sakte h. is tarah se hum apne API calls ko aur bhi efficient bana sakte h.

// what is the axios for the answer is that axios is a promise based HTTP client for the browser and node.js. it makes it easy to send asynchronous HTTP requests to REST endpoints and perform CRUD operations. it also provides features like interceptors, request cancellation, and automatic JSON data transformation. in our case we are using axios to make API calls to our backend server to perform authentication related operations like register, login, forgot password, reset password etc.
// and the fatch function is a built in JavaScript function that allows us to make HTTP requests to a server. it returns a promise that resolves to the response of the request. we can use the fetch function to make API calls to our backend server, but axios provides a more convenient and powerful way to make HTTP requests, with features like interceptors, automatic JSON data transformation, and better error handling. that's why we are using axios instead of fetch in our application.
//the diffrence between axios and fetch is that axios is a promise based HTTP client for the browser and node.js, while fetch is a built in JavaScript function that allows us to make HTTP requests to a server. axios provides features like interceptors, automatic JSON data transformation, and better error handling, while fetch does not have these features built in. axios also has a simpler syntax for making API calls compared to fetch. overall, axios is a more powerful and convenient tool for making HTTP requests in JavaScript applications.

//jo axios or fatch function h wo dono hi HTTP requests karne ke liye use hote h lekin axios ek third party library h jo ki promise based HTTP client h aur fetch ek built in JavaScript function h. axios me hum apne API calls ke liye interceptors, automatic JSON data transformation, aur better error handling jaise features ka use kar sakte h jabki fetch me ye features built in nahi hote. axios ka syntax bhi fetch ke mukable me simple hota h. overall, axios JavaScript applications me HTTP requests karne ke liye ek powerful aur convenient tool hai.

//promisbased HTTP client ka matlab hai ki jab hum axios ka use karke API call karte h to wo ek promise return karta h jisse hum .then() aur .catch() methods ka use karke handle kar sakte h. iska fayda ye h ki hum apne asynchronous code ko zyada clean aur readable bana sakte h. jab hum fetch function ka use karte h to wo bhi ek promise return karta h lekin usme error handling thodi tricky hoti h kyunki fetch sirf network errors ko catch karta h aur HTTP errors ko nahi, jabki axios me hum easily HTTP errors ko bhi catch kar sakte h. is tarah se axios ke promise based nature se hum apne API calls ko zyada efficient aur manageable bana sakte h.

//promise ki defination y h ki a promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. it allows us to write asynchronous code in a more synchronous manner, making it easier to read and maintain. a promise can be in one of three states: pending, fulfilled, or rejected. when a promise is fulfilled, it means that the asynchronous operation has completed successfully and the resulting value is available. when a promise is rejected, it means that the asynchronous operation has failed and an error is available. we can use .then() method to handle the fulfilled state and .catch() method to handle the rejected state of a promise. overall, promises are a powerful tool for managing asynchronous operations in JavaScript applications.

// promis  ek object represent karta h jo ki asynchronous operation ke eventual completion ya failure ko represent karta h aur uske resulting value ko bhi represent karta h. isse hum apne asynchronous code ko zyada synchronous manner me likh sakte h jisse ki code ko padhna aur maintain karna asaan ho jata h. ek promise ke teen states hote h: pending, fulfilled, aur rejected. jab ek promise fulfilled hota h to iska matlab hota h ki asynchronous operation successfully complete ho gaya hai aur resulting value available hai. jab ek promise rejected hota h to iska matlab hota h ki asynchronous operation fail ho gaya hai aur ek error available hai. hum .then() method ka use karke fulfilled state ko handle kar sakte h aur .catch() method ka use karke rejected state ko handle kar sakte h. overall, promises JavaScript applications me asynchronous operations ko manage karne ke liye ek powerful tool hai.

//async opration jo hote h wo aise operations hote h jo ki time consuming hote h aur jinka result turant available nahi hota. jaise ki API calls, file reading, database queries etc. in operations ko asynchronous kehte h kyunki ye operations background me chalte h aur jab tak ye complete nahi hote tab tak hum apne code ko aage badha sakte h. is tarah se hum apne application ko responsive aur efficient bana sakte h. async operations ko handle karne ke liye hum promises ya async/await ka use karte h jisse ki hum apne asynchronous code ko zyada clean aur readable bana sakte h.



})
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;

    // yha pr config object me hum apne request ke headers me authorization header add kar rahe h jisme hum apne token ko send kar rahe h. isse hum apne protected routes ko access kar sakte h jaha par hume authentication ki jarurat hoti h. agar token available hai to hum usse authorization header me add kar dete h aur phir request ko aage badha dete h. is tarah se hum apne API calls me authentication token ko easily manage kar sakte h.

});

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Registration failed";
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Login failed";
    }
};

export default api;