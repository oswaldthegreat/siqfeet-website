app.post("/api/products",(req,res)=>{
    const {product,color} = req.body;

    if(!product || !color) return res.status(400).send({message:"Product and color are required"});

    MockProducts.push({product,color});

   res.status(201).send({message:"Product added successfully",
       "newProducts": MockProducts
   });

   
});