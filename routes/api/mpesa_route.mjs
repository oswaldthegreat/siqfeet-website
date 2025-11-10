import dotenv from "dotenv";
import express from "express";

import axios from "axios";
import { isLoggedIn } from '../../middleware/is_logged_in.mjs';
import datetime from "node-datetime"
import Order from "../../mongoose/scheemas/Order.mjs";

dotenv.config();



const router = express.Router();
router.use(express.json());


// MPesa API credentials.....consumers key, secret,...used for getting an access token... 

//MPesa shortcode, passkey for creating the password that is used for the transaction
const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, PASSKEY, CALLBACK_URL } = process.env;


//Get access token from MPesa API
const getAccessToken = async () => {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    try {
        const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        console.log("Access Token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error);
        throw error;
    }
}

router.post("/stk_push", isLoggedIn, async (req, res) => {

    const token = await getAccessToken();
    const user = req.user;
    console.log(`the user logged in is : ${user.username}`);

    try {

    } catch (error) {
        res.status(500).json({ error: error.message });

    }


    try {



        const { phone_number, amount, DescriptionOfWhatTheUserPaidFor, CartItems } = req.body;
        console.log(`The cart items are : ${CartItems}`);
        if (!phone_number || !amount) {
            return res.status(400).json({ error: "phone_number and amount are required" });
        }


        // Create order with pending status
        const order = await Order.create({

            user: user._id,

            items: user.cart.map(item => ({
                product_id: item.product,
                quantity: item.quantity,
                productName: item.productName,
                price: item.priceAtAdd
            })),
            total: amount,
            status: "pending"
        });


        const dt = datetime.create();
        const timestamp = dt.format('YmdHMS');

        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                BusinessShortCode: SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phone_number,
                PartyB: SHORTCODE,
                PhoneNumber: phone_number,
                CallBackURL: CALLBACK_URL,
                AccountReference: DescriptionOfWhatTheUserPaidFor,
                TransactionDesc: DescriptionOfWhatTheUserPaidFor
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        //here were saving the CheckouRequestId and the response code so that we can  save it 
        const { CheckoutRequestID, ResponseCode } = response.data;
        await Order.findByIdAndUpdate(order._id, { 'payment.mpesa.checkoutRequestID': CheckoutRequestID });



        res.json(response.data);

    } catch (error) {
        console.error("Error in /access_token route:", error);
        res.status(500).json({ stk: "error in stk_actual push", error: error.message });
    }
});

router.post("/callback", async (req, res) => {

    //so here we have recieved the callback json from mpesa api after the stk push request as a req.body after mpesa has processed the request
    console.log("MPesa Callback received:", req.body);

    const callback = req.body;

    const checkoutID = callback.Body.stkCallback.CheckoutRequestID;
    const merchantRequestID = callback.Body.stkCallback.MerchantRequestID;
    //the result code and description will help us know whether the transaction was successful or failed ,0 is for successful transaction


    const resultCode = callback.Body.stkCallback.ResultCode;
    const resultDesc = callback.Body.stkCallback.ResultDesc;

    //so here since had initially set the order CheckoutRequestID when creating the order we can now find the order using that checkoutID and update it on whther it failed or not
    const order = await Order.findOne({ 'payment.mpesa.checkoutRequestID': checkoutID });

    if (order) {
        order.payment.method = "mpesa";
        order.payment.mpesa.merchantRequestID = merchantRequestID;
        order.payment.mpesa.checkoutRequestID = checkoutID;
        order.payment.mpesa.resultCode = resultCode;
        order.payment.mpesa.resultDesc = resultDesc;
        order.status = resultCode === "0" ? "success" : "failed";
        await order.save();
    }

    res.status(200).json({ message: "Callback received successfully" });
});

export default router;