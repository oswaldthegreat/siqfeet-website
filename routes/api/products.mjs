import {Router} from "express";
const router = Router();
import { MockProducts } from "../../data/data.mjs";
import express from 'express';

import { body, param,matchedData } from "express-validator";

import {Product} from "../../mongoose/scheemas/products.mjs";


router.use(express.json());

import { validateRequest, GetProductByQueryParams } from "../../middleware/middleware.mjs";

router.get("/api/products/:product", 
    param("product")
        .isString().withMessage("The value is not a string")
        .notEmpty().withMessage("The value you provided was empty"),
    validateRequest,
    GetProductByQueryParams, 
    (req, res) => {
        const { productIndex } = req;
        const productItem = MockProducts[productIndex];
        res.send(productItem);
    }
);




router.post("/api/products",
    [
        body("product").notEmpty().withMessage("The product field was empty"),
        body("color").notEmpty().withMessage("The color field was empty")
    ],
    validateRequest,
    async (req, res) => {

        const data = matchedData(req);
        
        const newProduct = new Product(data);

         try {
        const savedProduct = await newProduct.save();
        return res.status(201).send(savedProduct);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error:`The product ${error.keyValue.product} already exists`
            });
        }
    }
    }
);

router.put("/api/products/:product",
    [
        body("product").notEmpty().withMessage("The product is empty"),
        body("color").notEmpty().withMessage("The color section is empty"),
        param("product").notEmpty().withMessage("The product param is empty")
    ],
    validateRequest,
    GetProductByQueryParams,
    (req, res) => {
        const data = matchedData(req);

        const { productIndex } = req;

        MockProducts[productIndex] = { ...data };

        res.send({
            message: "Product updated successfully",
            updatedProducts: MockProducts
        });
    }
);

router.patch("/api/products/:product", 
    [
        body("product").optional().notEmpty().withMessage("The product is empty"),
        body("color").optional().notEmpty().withMessage("The color section is empty"),
        param("product").notEmpty().withMessage("The product param is empty")
    ],
    validateRequest,
    GetProductByQueryParams,
    (req, res) => {
        const data = matchedData(req);
        const { productIndex } = req;

        MockProducts[productIndex] = { ...MockProducts[productIndex], ...data };

        res.send({
            message: "Product updated successfully",
            updatedProducts: MockProducts
        });
    }
);

router.delete("/api/products/:product",
    param("product").notEmpty().withMessage("The product param is empty!!!"),
    validateRequest,
    GetProductByQueryParams,
    (req, res) => {
        const { productIndex } = req;

        MockProducts.splice(productIndex, 1);

        return res.send({
            message: "Product deleted successfully",
            updatedProducts: MockProducts
        });
    }
);

export default router;