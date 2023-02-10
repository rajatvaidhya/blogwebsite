const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { head } = require("lodash");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", true);

//Your MongoDB connection string here.
mongoose.connect('mongodb://127.0.0.1:27017/blog-web', {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title:String,
  body:String,
  image:String
})

const Post = mongoose.model("Post", postSchema);

//Image Upload using Multer
var Storage = multer.diskStorage({
  destination:"./public/images",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');

app.get("/", function(req,res){

  Post.find(function(err, posts){
    if(err) {
      console.log(err);
    } else {
      res.render("home",{posts:posts});
    }
  })
})

app.get("/about", function(req,res){
  res.render("about");
})

app.get("/contact", function(req,res){
  res.render("contact");
})

app.get("/compose", function(req,res){
  res.render("compose");
})

app.get("/posts/:topic",function(req,res){

  const requestedId = req.params.topic;

  Post.findOne({_id:requestedId}, function(err, found){
      res.render("post",{postTitle:found.title, postBody:found.body, postImage:found.image});
  })
})

app.post("/compose",upload,function(req,res){
  
  const post1 = new Post({
    title : _.capitalize(req.body.postTitle),
    body : req.body.postBody,
    image : req.file.filename
  })

  post1.save();
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});