const User = require("../MODELS/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
}
module.exports.signup =  async(req,res,next)=>{
    try{
    let {username, email, password} = req.body
    const newuser = new User({username,email})
    let registerUser =  await User.register(newuser,password) 
    req.login(registerUser, (err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Welcome to Wanderlust")
        res.redirect("/listings")
    })
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login")
}

module.exports.login = async(req,res)=>{
        req.flash("success", "Welcome back to Maxhotel")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)

}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success", "you are logout now")
        res.redirect("/listings")
    })
}