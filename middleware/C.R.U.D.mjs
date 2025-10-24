import { Product } from "../mongoose/scheemas/products.mjs";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const imageUrls = req.files && req.files.length > 0
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];


    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageUrls,
    });

    
     res.redirect("/products");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.imageUrl = req.file.path;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.json({ message: "Product updated", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
