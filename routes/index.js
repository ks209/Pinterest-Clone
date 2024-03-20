var express = require('express');
var router = express.Router();

const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local');

const upload = require("./multer")

passport.use (new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash('error')});
  console.log(req.flash('error'));
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req, res, next) {
});

router.post('/upload', isLoggedIn, upload.single('file'), async function(req,res,next){
  if(!req.file){
    return res.status(404).send("no files were found")
  }
  const user = await userModel.findOne({username:req.session.passport.user})

  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.postText,
    user: user._id,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
})

router.get('/logout', function(req,res){
  req.logout(function(err){
    if(err) {
      return next(err);
    }
    res.redirect('/login');
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get('/profile', isLoggedIn , async function (req,res,next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts')
  console.log(user);
  res.render("profile",{user: user});
})

router.get('/feed', isLoggedIn , async function (req,res,next){
  const allPost = await postModel.find();
  console.log(allPost);
  res.render("feed", {allPost: allPost});
});

router.post("/deletepost",async function(req,res){
  const postData = await postModel.findOneAndDelete({_id: req.body.cardId})
  console.log(postData);
  res.redirect("profile");
})

router.post("/register", function(req, res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    
  });

  userModel.register(userData, req.body.password)
  .then(function(registeruser){
    passport.authenticate("local") (req,res, function(){
      res.redirect('/profile');
    })
  })
  });

module.exports = router;
