const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   };
module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const listing = await Listing.find({
      $or: [
        { country: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    });

   // return res.status(200).json(listing);
    res.render("listings/index.ejs", { allListings:listing });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


  module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;
    try {
      if (category) {
        allListings = await Listing.find({
          category: { $regex: new RegExp(category, "i") }
        });
      } else {
        allListings = await Listing.find({});
      }
      res.render("listings/index.ejs", { allListings, selectedCategory: category });
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).send("Something went wrong.");
    }
  };

  module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews",
       populate: {
         path: "author",
        },
  }).populate("owner");
    if(!listing){
      req.flash("error","Listing doesn't exist");
      res.redirect("/Listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res,next) => {
      let url = req.file.path;
      let filename = req.file.filename;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
      await newListing.save();
      req.flash("success","New Listing Created");
      res.redirect("/Listings");
  };

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing doesn't exist");
      res.redirect("/Listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file != "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }

    req.flash("success","Listing updated successfully!")
    res.redirect(`/Listings/${id}`);
  };

  module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/Listings");
  };