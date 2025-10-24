import passport from 'passport';
import {Strategy,} from "passport-local";


import {User} from "../mongoose/scheemas/users.mjs";

import { comparePasswords } from '../password_hash_module/helpers.mjs';


passport.serializeUser((user,done)=>{
    console.log("inside Serialise User");
    done(null,user.username);
});

passport.deserializeUser(async (username,done)=>{
    try {
        const findUser = await User.findOne({username});
        
        if (!findUser) throw new Error("User not found");
        done(null,findUser);
        
    } catch (error) {
        done(error,null)
        
    }
});


export default passport.use(
    new Strategy(async (username,password,done)=>{
        try {
            const findUser = await User.findOne({username});

            if(!findUser) {
                return done(null,false,{message:"no user that matches the credentials provided exists"});
            }

            if(!comparePasswords(password,findUser.password)) {
                return done(null,false,{message:"the password provided is incorrect"});
            }

            done(null,findUser);

        } catch (error) {

            done(error,null);
        }
    })
);