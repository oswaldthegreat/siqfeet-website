app.get("/api/products", (req, res) => {

    const { query: { filter, value } } = req;

    if (!filter || !value) return res.status(400).send({ message: "Filter and value are required" });

    if (filter && value) {
        const filteredProducts =
            MockProducts.filter((item) => item[filter].includes(value));
            
            if(filteredProducts.length === 0) return res.status(404).send({message:"No products found"});


            return res.send(
                filteredProducts);
    }
    res.send(MockProducts);
})