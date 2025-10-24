import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

const MockUsers = [{ name: "Joee Doe", username: "Joe P" },
    { name: "Oswald Gikandi", username: "oswxld" }];

const MockProducts = [{ product: "T-shirt", color: "black" },
    { product: "T-shirt", color: "white" },
    { product: "long-sleeve T-shirt", color: "white" },
    { product: "long-sleeve T-shirt", color: "white" }];

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/users", (req, res) => {
  res.send(MockUsers);
});

app.get("/api/products", (req, res) => {
  res.send(MockProducts);
});

app.get("/api/users/:username",(req,res)=>{
    const {username} = req.params;
    const user = MockUsers.find((user)=>user.username === username);
    if(!user) return res.status(404).send({message:"User not found"});
    res.send(user);
    //so here we have something called request parameters ..which are dynamic values that can be passed in the url
    //we define them using a colon followed by the parameter name
    //we can access them using req.params object
    //in this case we are accessing the username parameter
    //we then use it to find a user in the MockUsers array
    //if the user is not found we return a 404 status code with a message
    //if the user is found we return the user object
});
 