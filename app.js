var bodyParser  = require("body-parser"),
    methodOver  = require("method-override"),
    mongoose    = require("mongoose"),
    sanitizer   = require("express-sanitizer"),
    express     = require("express"),
    app         = express();
    
    
//APP CONFIG   
mongoose.connect("mongodb://localhost/restful_blog_app");   
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOver("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})


var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test blog",
//     image: "http://actualapple.com/wp-content/uploads/2016/06/6f3e4e38fd90007f9cca0586382d3184.jpg",
//     body: "Take my money!"
// })

app.get("/", function(req, res){
    res.redirect("/blogs");
});
//index
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
      if(err){
          console.log("error!");
      }  else {
          res.render("index",{blogs: blogs });
      }
    })
});
//new
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});
//create
app.post("/blogs", function(req,res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
          res.render("new");
      } else {
          res.redirect("/blogs");
      }
   });
});
//show
app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, showBlog){
      if(err){
          console.log("error");
      } else {
          res.render("show", {blog: showBlog});
      }
  })

});

//EDIT
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
            res.render("edit", {blog: foundBlog}); 
       }
    });

});

//UPDATE//
app.put("/blogs/:id", function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id ,req.body.blog, function(err,updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id)
      }
   });
});


//DELETE
app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
});

    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("blog server has started"); 
});