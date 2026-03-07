const express = require("express");
const router = express.Router();
const WrapAsync = require("../utlis/WrapAsync");
const Listing = require("../MODELS/listing");
const {isLoggedIn,isOwner, validateListing} = require("../middleware")
const listingController = require("../controllers/listings")
const multer = require("multer");
const { storage } = require("../cloudinaryConfigue");
const upload = multer({ storage });




router
.route("/")
.get(WrapAsync(listingController.index))
.post(isLoggedIn,
upload.single("listing[image][url]"),
validateListing, 
WrapAsync(listingController.create));

// NEW (IMPORTANT: above /:id)

router.get("/category/:cat", WrapAsync(async (req, res) => {
  let { cat } = req.params;

  const listings = await Listing.find({ category: cat });

  res.render("listings/index", { allListings: listings });
}));

router.get("/search", async (req, res) => {

    let { country } = req.query;

    let allListings = await Listing.find({
        $or:[
            {country: {$regex: country,$options:"i"}},
            {location: {$regex: country,$options:"i"}}
        ]
    });

      if(allListings.length === 0){
        req.flash("error","No listing found");
        return res.redirect("/listings");
    }

    res.render("listings/index", { allListings });

});

router.get("/new", isLoggedIn,listingController.renderNewForm );
// update,destroy,show
router.route("/:id")
.put(isLoggedIn,isOwner, validateListing,upload.single("listing[image][url]"), WrapAsync(listingController.update))
.delete(isLoggedIn,isOwner, WrapAsync(listingController.destroy))
.get(WrapAsync(listingController.show));


// INDEX
// router.get(WrapAsync(listingController.index))
router.get("/:id/edit",isLoggedIn,isOwner, WrapAsync(listingController.edit));
module.exports = router;