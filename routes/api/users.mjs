import {Router} from "express";
const router = Router();
import { MockUsers, } from "../../data/data.mjs";
import express from 'express';
import passport from 'passport';
import { isLoggedIn } from "../../middleware/is_logged_in.mjs";


import { body,param,matchedData } from "express-validator";

import { validateRequest, GetUserByQueryParams } from "../../middleware/middleware.mjs";

import {User} from "../../mongoose/scheemas/users.mjs";

import { hashPassword } from "../../password_hash_module/helpers.mjs";

router.use(express.json());


router.post("/api/LOGIN/auth",[
        body("username").notEmpty().withMessage("The username field was empty"),
        body("password").notEmpty().withMessage("The password field was empty")
    ],
    validateRequest,
  passport.authenticate("local",{
  failureRedirect: '/login',
   failureFlash: true // optional if using flash messages
  }),(req,res)=>{
    const returnTo = req.session.returnTo || '/';
delete req.session.returnTo;
 // or set passport login
res.redirect(returnTo);

  });


router.post("/api/register/users",[
        body("username").notEmpty().withMessage("The username field was empty"),
        body("name").notEmpty().withMessage("The name field was empty"),
        body("email").isEmail().withMessage("The email field must be a valid email"),
        body("password").notEmpty().withMessage("The password field was empty")
    ],
    validateRequest,async (req,res)=>{
    
      const existingUser = await User.findOne({username: req.body.username});
      if (existingUser) {
        req.flash("error", "Username already taken");
        return res.redirect("/register");
      }


    const ValidatedData = matchedData(req);

    ValidatedData.password = hashPassword(ValidatedData.password);
    
    const newUser = new User(ValidatedData);

    try {
        const savedUser = await newUser.save();
        if (savedUser) {
          req.flash("success", "User registered successfully. Please log in.");
          return  res.redirect("/login");
        }

        
    } catch (error) {
      if (error.code === 11000) {
        req.flash("error", `The username ${error.keyValue.username} is already taken`);
        return res.redirect("/register");
      }
        req.flash("error", "An error occurred while creating the user");
        return res.redirect("/register");
    }
    
})

router.post("/api/LOGIN/logout",isLoggedIn,(req,res,next)=>{
  req.logout((err)=>{
    if(err) return res.sendStatus(200).json({message:"an error occurred while logging out the user",error:err});
    res.send("user logged out successfully");
  })
});



router.get(
    "/api/users", (req, res) => {
        console.log(req.cookies);
        if(req.signedCookies && req.signedCookies.username === "Oswald"){
            return res.send(MockUsers);

        }
    return res.status(401).json({message:"unauthorized,no cookie present" })
});

router.get(
    "/api/users/:username", 
        param("username")
            .isString().withMessage("The value is not a string")
            .notEmpty().withMessage("The value you provided was empty"),
        validateRequest,
        GetUserByQueryParams, 
        (req, res) => {
            const { usernameIndex } = req;
            const user = MockUsers[usernameIndex];
            res.send(user);
        }
);



export default router;