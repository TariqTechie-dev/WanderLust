function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports = wrapAsync;


// ye  ak utility function hai jo async functions ko wrap karta hai taki agar koi error aaye to wo automatically next() function ke through error handling middleware tak pahunch jaye. Isse hum apne route handlers me try-catch blocks likhne se bach sakte hain aur code zyada clean aur readable ho jata hai.

// Is function ko use karne ke liye, aap apne async route handlers ko wrapAsync function ke andar pass kar sakte hain. Jaise ki: