const express = require("express");
const User = require("../MODELS/user");
const router = express.Router();
const WrapAsync = require("../utlis/WrapAsync");
const passport = require("passport")
const {saveUrl} = require("../middleware")
const userController = require("../controllers/user")


router.route("/signup")
.get(userController.renderSignupForm)
.post(WrapAsync(userController.signup));

// Login

router.route("/login")
.get(userController.renderLoginForm )
.post(saveUrl ,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
userController.login);
router.get("/logout", userController.logout)

module.exports = router;