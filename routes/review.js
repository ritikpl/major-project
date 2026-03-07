const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utlis/WrapAsync");
const Review = require("../MODELS/review");
const Listing = require("../MODELS/listing");
const {validateReview,isLoggedIn,isauthor} = require("../middleware")
const reviewController = require("../controllers/review")



// ✅ POST Review
router.post("/",isLoggedIn,  validateReview, WrapAsync(reviewController.createReview));

// ✅ DELETE Review
router.delete("/:reviewId", isLoggedIn, isauthor, WrapAsync(reviewController.destroyReview));

module.exports = router;