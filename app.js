var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
var mongoose =require('mongoose');
mongoose.connect("mongodb://localhost/blog_app");

app.use(express.static("public"));

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body: String,
	created:{type:Date,default:Date.now}
});


var blog=mongoose.model("blog",blogSchema);

app.get("/",function(req,res){
	res.redirect("/blogs");
});


app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err)
			console.log("something went wrong!!");
		else
			res.render("index",{blogs:blogs});
	})
});


app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	blog.create(req.body.blog,function(err,newlyCreated){
		if(err)
			console.log("something went wrong");
		else
			res.redirect("/blogs");
	});
});

app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,findBlog){
		res.render("show",{blog:findBlog});
	})
});

app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,findBlog){
		res.render("edit",{blog:findBlog});
	})
});

app.put("/blogs/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,newBlog){
		res.redirect("/blogs/"+req.params.id);
	})
});

app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/blogs");
	})
});
app.listen(3000,function(){
	console.log("server listening on port 3000");
});
