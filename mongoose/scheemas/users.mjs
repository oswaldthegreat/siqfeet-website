/*
🔹 What is a Schema?

A schema is like a blueprint or structure for how data is organized in a database.

In MongoDB (NoSQL) → documents are stored in collections (not tables), and each document is JSON-like. A schema here describes what fields exist in those documents and what types they should be.

🔹 Example: With Schema (using Mongoose in Node.js)

You can enforce structure:

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
  email: { type: String, unique: true }
});

const User = mongoose.model("User", userSchema);


Now all your User documents will follow this “blueprint”:

Must have a name (string).

Age must be a number ≥ 0.

Email must be unique.
*/



/**
 * 🔹 What is a Model in Mongoose?

A Schema is the blueprint (what the data looks like).

A Model is the actual constructor/class you use to create, read, update, and delete documents in MongoDB.

Think of it like:

Schema = the plan for a house 🏠 (blueprint).

Model = the construction company 🛠️ (that builds actual houses from the plan).

Document = the actual house built 🏡 (data stored in MongoDB).


import mongoose from "mongoose";

// 1. Define Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  email: { type: String, unique: true }
});

// 2. Create Model from Schema
const User = mongoose.model("User", userSchema);

// 3. Use Model to interact with DB
// Create a new user
const newUser = new User({
  name: "Oscar",
  age: 19,
  email: "oscar//example.com"
});

// Save to DB
await newUser.save();

// Find users
const users = await User.find();
console.log(users);

 * 
 * 
 * 
 * 
 * 
 */

import mongoose from "mongoose";
import { Product } from "./products.mjs";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  productName: { type: String, required: true },

  quantity: { type: Number, default: 1 },

  priceAtAdd: Number, // store price snapshot
  
  addedAt: { type: Date, default: Date.now }
});





const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  googleId: {
    type: String
  },

  discordId: {
    type: String
  },

  isAdmin: {
     type: Boolean, 
     default: false 
    },

  name: {
    type: String,
    required: true

  },

  
  
  password: {
    type: String,
    required: true,

  },


  cart: [CartItemSchema]
});

export const User = mongoose.model("User", UserSchema);