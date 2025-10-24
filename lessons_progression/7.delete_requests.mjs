app.delete("/api/products/:product",(req,res)=>{
    const {product} = req.params;
    const productIndex = MockProducts.findIndex((item)=> item.product === product);

    if(productIndex === -1) return res.status(404).send({message:"Product not found"});
    MockProducts.splice(productIndex,1);

    return res.send({message:"Product deleted successfully",
    updatedProducts: MockProducts
    });
})