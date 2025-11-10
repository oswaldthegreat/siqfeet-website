// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({


  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    
    productName: String,

    

    quantity: Number,

    price: Number
  }],


  total: Number,
  
  status: { type: String, default: 'pending' }, // pending, paid, failed, shipped ...
  payment: {
    method: String, // mpesa, card etc
    mpesa: {
      merchantRequestID: String,
      checkoutRequestID: String,
      resultCode: Number,
      resultDesc: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
