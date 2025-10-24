import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/users", (req, res) => {
  res.send([{ name: "Joee Doe", username: "Joe P" },
    { name: "Oswald Gikandi", username: "oswxld" }]);
});

app.get("/api/products", (req, res) => {
  res.send([{ product: "T-shirt", color: "black" },
    { product: "T-shirt", color: "white" },
    { product: "long-sleeve T-shirt", color: "white" },
    
    { product: "long-sleeve T-shirt", color: "white" }]);
});

//with get requests we can create endpoints that respond to client requests
//we use app.get to create a get request endpoint
//the first parameter is the endpoint path and the second parameter is a callback function that takes in a request and response object
//we can use res.send to send a response to the client
//we can send strings, arrays, objects, etc