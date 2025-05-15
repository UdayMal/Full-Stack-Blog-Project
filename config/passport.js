const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
    // define the local strategy for email and password authentication
    passport.use(new LocalStrategy({ usernameField:"email" }, async (email,
        password, done) => {
        try{
            // find the user 
            const user = await User.findOne({ email });
            if(!user) {
                return done(null, false, {
                    message: "User not found with that email",
                });
            }   
            // compare the provided password with the hashed password in the database 
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }
            // authentication successful, return the user object 
            return done(null, user);
        } catch(error) {
            return done(error);
        }
    }
    )
    );

    // serializeUser: determines which data of the user object should be stored in the session. Here, we store the user ID.
    passport.serializeUser(function (user, done){
        done(null, user.id);
    });

    // deserialize the user object based on the user ID stored in the session 
    passport.deserializeUser(async function (id, done){
        try{
            const user = await User.findById(id);
            done(null, user);
        }
        catch(error){
            done(error);
        }
    })
}; 
