// will be putting all backend codes in this file
const port = 4000;

//importing dependencies
const express = require("express");

//creating instance of our app
const app = express();

//init the mongoose package
const mongoose = require("mongoose");

//init json webtoken
const jwt = require("jsonwebtoken");

//init multer
const multer = require("multer");

//including the path to the express server now,, by using this path we can get access to our backend directory in our express app
const path = require("path");

//init cors
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");


//line in an Express application is a middleware function that parses incoming requests with JSON payloads. It is a part of the Express.js framework and is essential for handling JSON data sent in HTTP request bodies.
app.use(express.json());


//our react js project will connect to the express app using the 4000 port
app.use(cors());

//creating mongodb atlas database
//Database connection with MONGO DB
mongoose.connect("mongodb+srv://DevontaeB:Midoriya123!@cluster0.od92qht.mongodb.net/Devpop-Ecomm");



//API Creation,, ast port 4000 our express server will be started

//creating an API
app.get("/", (req,res)=>{
  res.send("Express App is Running")
})


//Image Storage Engine

const storage= multer.diskStorage({
  destination: './upload/images',
  filename: (req,file,cb)=>{return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)}
})

const upload = multer({storage:storage})

//Creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req,res)=>{
  res.json({
    success:1,
    //API , will be testing the API in thunder client
    //Also must make sure to use http if it is http as it will cause error if using httpS*
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// Schema for Creating Products
//Setting the rules for each products in our database
const Product = mongoose.model("Product", {
  id:{
      type: Number,
      required:true,    
  },
  name:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  new_price:{
    type: Number,
    required:true,
  },
  old_price:{
    type:Number,
    required:true,
  },
  date:{
    type: Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    required:true,
  },

})


//Adding endpoint to add product

app.post('/addproduct', async (req,res)=>{
  //By doing the line below we fetche all documents from the Product collection.
  let products = await Product.find({});
  let id;
  if(products.length>0)
    {
      //.slice(-1) extracts last product of array
       let last_product_array = products.slice(-1);
       let last_product = last_product_array[0];
       //taking the last product in the array we will take the last products id and increment it by one so the new id will be one greater than the previous product
      id = last_product.id+1;
    }
    else{
      id =1;
    }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    available: true
  });
  console.log(product);
  //saving the product in the database, whwnever we save rpoduct in database we sue 'await' as it will take some time
  //afterwards it will save in the MongoDB database
  await product.save();
  console.log("Saved");
  res.json({
    success:true,
    name: req.body.name,
  })
})


//Creating API for deleting products
app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
      success:1,
      name: req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts', async (req,res)=>{
  //LINE below will use the product schema model in mongoose, get all products in array and store it in products var
    let products = await Product.find({})
    console.log("All Products Fetched");
    res.send(products);
})

//Creating Schema for User model
const Users = mongoose.model("Users", {
    name:{
      type: String,
    },
    email: {
      type: String,
      //Only one email id per user, all emails must be unique
      unique: true,
    },
    password: {
      type: String
    },
    cartData: {
      type: Object,
    },
    date:{
      type: Date,
      default: Date.now,
    }
})

//Creating endpoint API for registering the User
app.post('/signup', async (req,res)=>{
  //Check to see if we already have a user with this exact email in our database
  let check = await Users.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false,errors:"Existing user found with same email login"})
  }
  //creating an empty cart for the users account that makes an empty cart with 300 slots...
  let cart = {};
  for(let i = 0; i < 300; i++)
    {
      cart[i]=0;
    }
    //filling the users data into db using their entered data from UI
   const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
   })
   //creating user
   await user.save();

   //JWT authentication
   const data = {
    user: {
      id: user.id
    }
   }
   const token = jwt.sign(data, 'secret_ecom');
   res.json({success:true, token})
})


//Creating endpoint for user login
app.post('/login', async (req,res)=>{
  
  let user = await Users.findOne({email: req.body.email});
  {
    if(user){
      //Comparing the password located from the users API req compared to the password that we have in our database
      const passCompare = req.body.password === user.password;
      if(passCompare){
        const data = {
          user:{
            id: user.id
          }
        }
        //generating token
        const token = jwt.sign(data, 'secret_ecom');
        res.json({success:true, token});
      }
      else{
        res.json({success:false, error:"Wrong password"});
      }
    }
    else{
      res.json({success:false, error:"Wrong email address"});
    }
  }
})

app.get('/newcollections', async (req,res)=>{
  //find the empty products and will all be loaded into produts
  let products = await Product.find({});
  //in our new collection array we will get the most 8 recent products
  //The combination of these two operations effectively creates a new array that excludes the first element of products and then takes the last 8 elements of the remaining array. 
  let newcollection = products.slice(1).slice(-8);
  console.log("New Collection Fetched");
  res.send(newcollection);
});

//creating endpoint for popular in woman section
app.get('/popularinwomen', async(req,res) =>{
  //by putting category as women in will search for any products with category as women in the Product schema DB
  let products = await Product.find({category: "women"});
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
})

//Creating middleware to fetch user
const fetchUser = async (req,res,next) =>{
  //take the auth token and verify it, then find the user
  const token = req.header('auth-token');
  //if user is not logged in
  if(!token){
      res.status(401).send({errors:"Please authenticate using valid token"})
  }
  else{
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({errors:"Pleasse authenticate using valid token"})
    }
  }
} 


//Creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req,res)=>{
  console.log("Added", req.body.itemId);
  //will be looking inside the MongoDB to findOne user id
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added");
})

//creating endpoint to remove products from cartdata
app.post('/removefromcart', fetchUser, async (req,res)=>{
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId]>0)
    {

    }
  userData.cartData[req.body.itemId] -= 1
  await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
  res.send("Removed");
})

//creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req,res)=>{
  console.log("Get Cart");
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})

app.listen(port, (error)=>{
  if(!error){
    console.log("Server running on Port " + port)
  }
  else{
    console.log("Error : " + error)
  }
})