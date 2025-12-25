const User = require("../models/user.js");

module.exports.renderLandingpg = (req, res) => {
    return res.render("listings/home.ejs");
};

module.exports.renderSignupForm = (req, res) => {
    return res.render("user/signup.ejs");
};

module.exports.submitSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User Registered Successfully!!");
            return res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    return res.render("user/login.ejs");
};

/*
IMPORTANT:
Use this controller ONLY if your route does NOT use
successRedirect / successFlash inside passport.authenticate
*/
module.exports.submitLogin = (req, res) => {
    req.flash("success", "Logged in Successfully!!");
    const redirectUrl = res.locals.redirect || "/listings";
    return res.redirect(redirectUrl);
};

module.exports.renderLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged-Out Successfully!!");
        return res.redirect("/listings");
    });
};
