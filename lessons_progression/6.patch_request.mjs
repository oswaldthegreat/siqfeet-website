app.patch("/api/products/:product",(req,res)=>{
    const {body} = req;
    const {product} = req.params;

    const productIndex = MockProducts.findIndex((item)=> item.product === product);

    if(productIndex === -1) return res.status(404).send({message:"Product not found"});

    MockProducts[productIndex] = {...MockProducts[productIndex],...body };

    res.send({message:"Product updated successfully",
    updatedProducts: MockProducts
    });
})