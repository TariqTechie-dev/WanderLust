require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SECRET,
  touchAfter: 24 * 60 * 60, // time period in seconds
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionoptions = {
    store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week  expires = exact date/time
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week maxAge = time in milliseconds
  },
};

app.use(session(sessionoptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

// 404 HANDLER
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).render("error.ejs", { message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
