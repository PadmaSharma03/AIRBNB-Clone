const express = require("express");
const router = express.Router( {mergeParams : true});
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ExpressError = require("../utilities/ExpressError.js");
const { createReview } = require("../controllers/reviews.js");

const listingController = require("../controllers/listings.js");
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post route
router.post("/", isLoggedIn ,validateReview, wrapAsync( reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( reviewController.destroyReview));

module.exports = router;
