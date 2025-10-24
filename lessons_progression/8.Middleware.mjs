//middle ware is asically request handler that has access to the request and response cycle
//so tthere are two ways to use middlewares
//you can use the like must paths for eac and every path which is asically registering them for every request
//or you can use them for specific routes
//to use them for specific routes yoou have to put the as an argument 
//lastly you have touse the next function to move to the next middleware or the final request handler
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const MockUsers = [
  { name: "Joee Doe", username: "Joe P" },
  { name: "Oswald Gikandi", username: "oswxld" },
];
const MockProducts = [
  { product: "T-shirt", color: "black" },
  { product: "T-shirt", color: "white" },
  { product: "long-sleeve T-shirt", color: "white" },
  { product: "long-sleeve T-shirt", color: "white" },
];


const GetSomethingByQueryParams = (req, res, next) => {
    const { product } = req.params;

    const productIndex = MockProducts.findIndex((item)=> item.product === product);

    if (productIndex === -1) {
        return res.status(404).send({ message: "Product not found" });
    }

    

    req.productIndex = productIndex;
    



    next();
};

app.put("/api/products/:product",GetSomethingByQueryParams,(req,res)=>{
    const {body} = req;
    const {productIndex} = req;

    MockProducts[productIndex] = {...body };

    res.send({message:"Product updated successfully",
    updatedProducts: MockProducts
    });
})
app.patch("/api/products/:product",GetSomethingByQueryParams,(req,res)=>{
    const {body,productIndex} = req;
    

    MockProducts[productIndex] = {...MockProducts[productIndex],...body };

    res.send({message:"Product updated successfully",
    updatedProducts: MockProducts
    });
})

app.delete("/api/products/:product",GetSomethingByQueryParams,(req,res)=>{
    const {productIndex} = req;
   
    MockProducts.splice(productIndex,1);

    return res.send({message:"Product deleted successfully",
    updatedProducts: MockProducts
    });
})
