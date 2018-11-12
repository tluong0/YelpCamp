var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


//================
//Auth Routes
//==============

router.get("/register", function(req, res) {
    res.render("register", {page:"register"});
});
//handle sign up
router.post("/register",function(req, res) {
    var newUsername = new User({username:req.body.username});
    User.register(newUsername, req.body.password, function(err,newlyCreated){
        if (err){
            req.flash("error",err.message);
            return res.redirect("register");
        }
        
            passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " + newlyCreated.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login",{page:"login"});
});
//handling login
router.post("/login", passport.authenticate("local", 

    {

        successRedirect: "/campgrounds",

        failureRedirect: "/login"

    }), function(req, res){

});
//logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});


module.exports = router;