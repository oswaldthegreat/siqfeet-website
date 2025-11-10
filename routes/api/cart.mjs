import express from 'express';
import { Product } from '../../mongoose/scheemas/products.mjs';
import { User } from '../../mongoose/scheemas/users.mjs';
import { isLoggedIn } from '../../middleware/is_logged_in.mjs';
import Order from '../../mongoose/scheemas/Order.mjs';



const router = express.Router();

// Add to cart
router.post('/cart/add', isLoggedIn, async (req, res) => {
  try {
    const username = req.user.username;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = req.user;
    // if exists increment quantity
    const item = user.cart.find(i => i.product.toString() === productId);
    if (item) {
      item.quantity += Number(quantity);
      item.priceAtAdd = product.price;
    } else {
      user.cart.push({ product: product._id, productName: product.name, quantity: Number(quantity), priceAtAdd: product.price });
    }
    await user.save();
    req.flash('success', 'Item added to cart successfully!!!..This will be siq!!');
    res.redirect('/cart');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/cart');
  }
});

// View cart page
router.get('/cart', isLoggedIn, async (req, res) => {
  try {
    // Passport puts the logged-in user on req.user
    const user = req.user;

    // Populate their cart if needed (optional)
    await user.populate('cart.product');

    res.render('cart', {
      user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




// Update quantity / remove
router.post('/cart/update', isLoggedIn, async (req, res) => {
  console.log("isnide the update route");

  const { productId, quantity } = req.body;

  

  const user = req.user;
  




const itemIndex = user.cart.findIndex(i => i.product._id.toString() === productId.trim());//the trim removes the extra space that exists before the id ...supposeddly





  if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

  if (Number(quantity) <= 0) {
    user.cart.splice(itemIndex, 1);
  } else {
    console.log("cart number updated");
    user.cart[itemIndex].quantity = Number(quantity);
  }
  await user.save();
  console.log("cart number update saved in database");
  req.flash('success', 'Cart updated!');
  res.json({ ok: true });
});

export default router;
