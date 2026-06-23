class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;

    }
}

module.exports = ExpressError;

// ye ek custom error class hai jo ExpressError naam se define ki gayi hai. Is class ko extend karke hum apne custom errors create kar sakte hain jo Express ke error handling mechanism ke sath seamlessly integrate ho jate hain. Is class ka constructor do parameters leta hai: message aur statusCode. message parameter me hum error ka message specify karte hain, aur statusCode parameter me HTTP status code specify karte hain jo error ke sath return hoga.

// Is class ko use karne ke liye, aap apne route handlers me is class ka instance create kar sakte hain jab bhi aapko koi error throw karna ho. Jaise ki:


