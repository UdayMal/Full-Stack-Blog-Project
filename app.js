 //const { log } = require("console");
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const User = require("./models/User");          
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes"); 
const passportConfig = require("./config/passport");
const errorHandler = require("./middlewares/errorHandler");                     
const commentRoutes = require("./routes/commentRoutes");
const methodOverride = require("method-override");  
const userRoutes = require("./routes/userRoutes");

// port 
const PORT = process.env.PORT || 3000;

// middlewares: passing form data 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session middleware 
app.use(
    session({
        secret: "keyboard cat", 
        resave: false,  
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    })
);

// method override middleware
app.use(methodOverride("_method"));
// passport 
passportConfig(passport); 
app.use(passport.initialize()); 
app.use(passport.session());

// ejs
app.set("view engine", "ejs");

// home route 
app.get("/", (req,res) => {
    res.render("home", {
        user: req.user,
        error: "",
        title: "Home", 
    });
});

// routes       
app.use("/auth", authRoutes);
app.use("/posts", postRoutes); 
app.use("/", commentRoutes);        
app.use("/user", userRoutes);

// error handler
app.use(errorHandler);

// start server   
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database connected");  
    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`);           
    });
}).catch(()=>{
    console.log("database connection failed");
}); 

module.exports = errorHandler;