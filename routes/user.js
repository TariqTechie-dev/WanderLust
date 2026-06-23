const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/user.js");
const wrapAsync = require("../Utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl, storeRedirectUrl } = require("../middleware.js");

router
  .route("/signup")
  // render signup form
  .get(Usercontroller.rendersignupform)
  //  create new user
  .post(wrapAsync(Usercontroller.signup));

router
  .route("/login")
  // render login form
  .get(storeRedirectUrl, Usercontroller.renderloginform)
  //  login existing account
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(Usercontroller.login),
  );

// logout user
router.get("/logout", Usercontroller.logout);

module.exports = router;
