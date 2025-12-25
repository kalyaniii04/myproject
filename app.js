// Load env only in development
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Fail fast if env variables are missing
if (!process.env.SECRET) {
    throw new Error("SECRET environment variable is missing");
}

if (!process.env.ATLAS_URL) {
    throw new Error("ATLAS_URL environment variable is missing");
}

const express = require("express");
const app = express();
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routes
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

// Database
const dbUrl = process.env.ATLAS_URL;

mongoose
    .connect(dbUrl)
    .then(() => console.log("Database Connected"))
    .catch(err => console.error(err));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session store
const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    touchAfter: 24 * 3600 // 1 day
});

store.on("error", (err) => {
    console.error("SESSION STORE ERROR:", err);
});

app.use(
    session({
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    })
);


// Flash
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404
app.all("/{*any}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (res.headersSent) return next(err);
    res.status(status).render("error.ejs", { err });
});

// PORT (Render compatible)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


