require('dotenv').config()
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
app.use(methodOverride("_method"));
const ExpressError = require("./utlis/ExpressError");
const session = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user")

const listingsRouter = require("./routes/listing")
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user")


const dbUrl = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("connected to DB");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});



const sessionOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly:true,
  },
}

// app.get("/", (req,res)=>{
//   res.render("/listings/rough")
    
// });
app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error")
  res.locals.curruser = req.user

  next()
})





app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter)




// 404 handler (ALWAYS last route)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).render("listings/error", { err });
});

app.listen(8080, ()=>{
    console.log("server is listing on 8080");
    
})
