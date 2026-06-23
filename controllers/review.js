const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//   create Review
module.exports.createReview = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing Not Found", 404);
  }

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully");

  res.redirect(`/listings/${id}`);
};

//   Delete Review
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");

  res.redirect(`/listings/${id}`);
};
