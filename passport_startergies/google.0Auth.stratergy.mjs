import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config(); // loads .env file into process.env


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  // This function runs after Google authenticates the user
  return done(null, profile);
}));

//client id = 1423754879016636526
//client secret = KNiyiW0P1e15BpSB6r4AprZ0wt6sGxML