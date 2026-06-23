const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/WrapAsync.js");
const { isLoggedIn, isowner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});
// const upload=multer({dest:"uploads/"});

//   router.route is a methode in express that help us to don't write  same path multiple time
router
  .route("/")
  .get(wrapAsync(listingcontroller.index)) // INDEX ROUTE
  .post(
    // CREATE  listing ROUTE
    isLoggedIn,
     upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.createListing),
  );
  
// NEW ROUTE
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showListing)) //show listing route
  .put(
    //update listing
    isLoggedIn,
    isowner,
     upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.updateListing),
  )
  .delete(isLoggedIn, isowner, wrapAsync(listingcontroller.destroyListing));

// EDIT ROUTE render edit form

router.get(
  "/:id/edit",
  isLoggedIn,
  isowner,
  wrapAsync(listingcontroller.renderEditForm),
);

module.exports = router;
