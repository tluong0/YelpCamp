var express = require("express");
var router   = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index route - show all campground
router.get("/", function(req, res){
   
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds,page:"campgrounds"});
        }
    });
    
    
});

//Create route - create new campground
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name, image:image, description:description, author:author, price:price};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyCreated){
        if (err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
    
});
// New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});    


//Show - show more info about one campground
router.get("/:id", function(req, res) {
    //Find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Sorry that campground does not exist!");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
    
});

//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.flash("error", "Can't locate campground");
            }
            res.render("campgrounds/edit", {campground:foundCampground});
        });
});
//update campground
router.put("/:id",middleware.checkCampgroundOwnership ,function(req,res){
    //find and update
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/campgrounds");
        } else {
     //redirect after        
            res.redirect("/campgrounds/"+ updatedCampground._id);
        }
    });
    
   
});

//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;