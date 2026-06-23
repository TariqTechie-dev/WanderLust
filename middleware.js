const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/review.js");



module.exports.isLoggedIn = (req, res, next) => {
    //  console.log(req)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl
        req.flash("error", "You must be signed in to access this page");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.storeRedirectUrl=(req,res,next)=>{
    const referer = req.get("Referer");
    if (referer) {
        try {
            const refererUrl = new URL(referer);
            const currentOrigin = `${req.protocol}://${req.get("host")}`;
            if (refererUrl.origin === currentOrigin && !refererUrl.pathname.startsWith("/login") && !refererUrl.pathname.startsWith("/signup") && !refererUrl.pathname.startsWith("/logout")) {
                req.session.redirectUrl = refererUrl.pathname + refererUrl.search;
            }
        } catch (e) {
            // ignore invalid referer values
        }
    }
    next();
}


module.exports.isowner=async(req,res,next)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// validate listing through joi package   
module.exports.validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// ✅ Validate Review (Joi)
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId} =req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
