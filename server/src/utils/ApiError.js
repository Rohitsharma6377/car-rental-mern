export class ApiError extends Error {
    constructor(
        statusCode = 500,
        message = "somthing went wrong please try again latter",
        error =[],
        stack =""

    ){
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.error = error;
        // Capture the stack trace (optional, but useful for debugging)
        if(stack){
            this.stack = stack;

        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError