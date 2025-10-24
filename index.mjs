import express from 'express';

import cookieParser from "cookie-parser";
import {AdminUsers,MockUsers} from "./data/data.mjs";
import passport from 'passport';
import "./passport_startergies/local.stratergy.mjs";
import { Product } from './mongoose/scheemas/products.mjs';
//import "./passport_startergies/discord.0Auth.stratergy.mjs"
import { dbConnect } from './middleware/database_connection.mjs';
import { sessionConfig } from './middleware/sessions_configuration.mjs';

import ProductsRouter from "./routes/api/products.mjs";
import CartRouter from "./routes/api/cart.mjs";
import UsersRouter from "./routes/api/users.mjs";
import flash from 'connect-flash';
import AuthRoutes from "./routes/api/admin_routes.mjs";


const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

await dbConnect();
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.SESSION_SECRET));


app.use(sessionConfig);


app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static('public'));


app.use(CartRouter);
app.use(UsersRouter);
app.use(ProductsRouter);
app.use("/api/admin", AuthRoutes);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//route handler for loging in users




app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/api/LOGIN/auth", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/register", (req, res) => {
  res.render("register");
});



app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("products", { products });
});

app.get("/product_details/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const relatedProducts = await Product.find({ category: product.category }).limit(4);
  res.render("product_details", { product, relatedProducts });
});


app.get("/admin", async (req, res) => {
  res.render("admin", { admin: "OSWALD" });
});

app.get("/contact", async (req, res) => {
  res.render("contact", { admin: "OSWALD" });
});





app.get("/api/login/auth/discord", passport.authenticate("discord"));

app.get("/api/login/auth/discord/redirect", passport.authenticate("discord"),
(req,res)=>{
  res.sendStatus(200);
});



//this is the page we creae authorised sessions in accordance to whether the user trying to login is an admin
app.post("/api/auth/", (req, res) => {
  const { body } = req;

  if (!body.username || !body.name) {
    return res.status(400).json({ message: "you must provide both username and name" });
  }

  // find a single user by name
  const user = AdminUsers.find(u => u.name === body.name);

  if (!user) {
    return res.status(404).json({ message: "no user matches the name you have entered" });
  }

  if (body.username !== user.username) {
    return res.status(404).json({ message: "no user matches the username/password you have entered" });
  }

  if (body.username === user.username && body.name === user.name) {
    req.session.user = user.name;
    return res.json({ message: "user logged in and authorized, proceed to the following pages" });
  }
});



app.get("/api/auth/users", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = AdminUsers.find(u => u.name === req.session.user);

    if (!user) {
        return res.status(404).json({ message: "Unauthorized session user" });
    }

    res.json({ message: `welcome ${user.name} here are ALL the users........`, users: MockUsers });
});

///api/aut/discord/redirect/
