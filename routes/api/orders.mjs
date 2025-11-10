import express from 'express';
import Order from '../../mongoose/scheemas/Order.mjs';
import { isLoggedIn } from '../../middleware/is_logged_in.mjs';
import { Product } from '../../mongoose/scheemas/products.mjs';

const router = express.Router();

// Get logged-in user's orders
router.get('/my-orders', isLoggedIn, async (req, res) => {

  try {
    const user = req.user;

    const orders = await Order.find({ user: user._id })
      .populate('items') // populates product details
      .sort({ createdAt: -1 });  // newest first

      

    res.render('orders', { user, orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching orders check your console logs');
  }
});

export default router;