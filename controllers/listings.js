const Listing = require("../MODELS/listing");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
}

module.exports.create = async (req, res) => {
  let url =  req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);

  if (
    !req.body.listing.image ||
    !req.body.listing.image.url ||
    req.body.listing.image.url.trim() === ""
  ) {
    newListing.image = {};
  }
  newListing.owner = req.user._id
  newListing.image = {url,filename}
  await newListing.save();
  req.flash("success","New listing is created")
  res.redirect(`/listings`);
}; 
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    let originalImageUrl = listing.image.url;
    if (!listing) {
    req.flash("error", "Listing you requested for  does not exit")
    return res.redirect("listings");
    }

  res.render("listings/edit",{listing,originalImageUrl});
}
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  if (
    updatedData.image &&
    updatedData.image.url &&
    updatedData.image.url.trim() === ""
  ) {
    delete updatedData.image;
  }
  let listing =  await Listing.findByIdAndUpdate(id, updatedData);
  if(typeof req.file !== "undefined"){
  let url =  req.file.path;
  let filename = req.file.filename;
  listing.image = { url ,filename }
  await listing.save()
  }
  req.flash("success","listing is updated")
  res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing is deleted")
  res.redirect("/listings");
}

module.exports.show = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{
      path:"author"
    }})
    .populate("owner");
    console.log(listing.reviews);

  res.render("listings/show", { listing });
}
