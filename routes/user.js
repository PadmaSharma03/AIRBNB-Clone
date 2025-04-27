const express = require("express");
const wrapAsync = require("../utilities/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, renderSignupForm, renderLoginForm, login } = require("../controllers/users.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync( userController.signup)
);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, 
    passport.authenticate("local", {
        failureRedirect : '/login', 
        failureFlash : true 
    }),
     userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;