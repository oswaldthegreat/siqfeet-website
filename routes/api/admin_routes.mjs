import express from "express";
import { upload } from "../../middleware/upload.mjs";
import { body, param, matchedData } from "express-validator";
import { validateRequest } from "../../middleware/middleware.mjs";
import { ensureAdmin } from "../../middleware/ensure_Admin_Middleware.mjs";
import { User } from "../../mongoose/scheemas/users.mjs";
import { getAllOrders, getOrderDetails } from "../../middleware/Admin_orders_middeware.mjs";
import Order from "../../mongoose/scheemas/Order.mjs";







import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../middleware/C.R.U.D.mjs";
import { Product } from "../../mongoose/scheemas/products.mjs";


const router = express.Router();

// Admin-only routes (add auth middleware later)
router.post("/add_product", upload.array("images", 10),
  [
    body("name").notEmpty().withMessage("The name field was empty"),
    body("price").notEmpty().withMessage("The price field was empty"),
    body("description").notEmpty().withMessage("The description field was empty"),
    body("stock").notEmpty().withMessage("The stock field was empty"),
    body("category").notEmpty().withMessage("The category field was empty"),
  ],
  validateRequest,
  createProduct);

router.get("/create-product", ensureAdmin, async (req, res) => {
  res.render("admin_products", { admin: "OSWALD" });
});




router.post('/delete_product/:id', ensureAdmin, deleteProduct);


router.get("/products", ensureAdmin, getAllProducts);
router.put("/products/:id", ensureAdmin, upload.single("image"), updateProduct);


router.delete("/products/:id", ensureAdmin, deleteProduct);








// Get all orders
// Get all orders
// Get all orders
router.get("/orders", ensureAdmin, getAllOrders);//NOTE..HERE THE RES.RENDER IS HANDLED IN THE MIDDLEWARE FUNCTION



// Get order details
// Get order details
// Get order details


router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "email name")
      .populate("items.product");

    if (!order) return res.status(404).send("Order not found");

    res.render("adminOrderDetails", { order });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});






//getting the products page for the admin
router.get("/products", ensureAdmin, async (req, res) => {
  const products = await Product.find();
  res.render("adminProducts", { products });
});

//users Admin permisions
router.get("/users", ensureAdmin, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});



export default router;
