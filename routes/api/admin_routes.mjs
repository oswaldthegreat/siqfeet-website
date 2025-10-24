import express from "express";
import { upload } from "../../middleware/upload.mjs";
import { body,param,matchedData } from "express-validator";
import { validateRequest} from "../../middleware/middleware.mjs";
import { ensureAdmin } from "../../middleware/ensure_Admin_Middleware.mjs";
import { User } from "../../mongoose/scheemas/users.mjs";



import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../middleware/C.R.U.D.mjs";


const router = express.Router();

// Admin-only routes (add auth middleware later)
router.post("/add_product",upload.array("images",10),
    [
            body("name").notEmpty().withMessage("The name field was empty"),
            body("price").notEmpty().withMessage("The price field was empty"),
            body("description").notEmpty().withMessage("The description field was empty"),
            body("stock").notEmpty().withMessage("The stock field was empty"),
            body("category").notEmpty().withMessage("The category field was empty"),
        ],
        validateRequest,
      createProduct);

router.get("/admin_products", async (req, res) => {
       res.render("admin_products");
     });
     

router.get("/products", ensureAdmin, getAllProducts);
router.put("/products/:id", ensureAdmin, upload.single("image"), updateProduct);
router.delete("/products/:id", ensureAdmin, deleteProduct);





//users Admin permisions
router.get("/users", ensureAdmin, async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});



export default router;
