const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./models/UserModel');


passport.use(new LocalStrategy(async(USERNAME, PASSWORD, done) => {
    try{
        // console.log('Received Credentials:', USERNAME, PASSWORD);
        const user = await UserModel.findOne({username: USERNAME});
        if(!user){
            return done(null, false, {message: 'User not found / Incorrect Username'});
        }
        
        const isPasswordMatch = await user.comparePassword(PASSWORD);
        if(isPasswordMatch){
            return done(null, user);
        }
        else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
    catch(err){
        return done(err);
    }
}))

module.exports = passport;