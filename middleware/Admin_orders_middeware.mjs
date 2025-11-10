import Order from "../mongoose/scheemas/Order.mjs";

//so this is the middleware for only admin to get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      //here we are getting user's name & email from the User model
      .sort({ createdAt: -1 }); // latest first

    res.render("adminOrders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching orders");
  }
};





//so this is the middleware for only admin to get order details
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price");
    if (!order) return res.status(404).send("Order not found");

    res.render("adminOrderDetails", { order });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching order details");
  }
};