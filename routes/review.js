const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/WrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");

// ✅ CREATE REVIEW (POST)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewcontroller.createReview),
);

// ✅ DELETE REVIEW
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewcontroller.destroyReview),
);

module.exports = router;
