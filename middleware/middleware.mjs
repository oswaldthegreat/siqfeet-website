import { validationResult} from "express-validator";
import { MockUsers,MockProducts } from "../data/data.mjs";


const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const GetProductByQueryParams = (req, res, next) => {
    const { product } = req.params;

    const productIndex = MockProducts.findIndex((item) => item.product === product);

    if (productIndex === -1) {
        return res.status(404).send({ message: "Product not found" });
    }

    req.productIndex = productIndex;
    next();
};

const GetUserByQueryParams = (req, res, next) => {
    const { username } = req.params;

    const usernameIndex = MockUsers.findIndex((user) => user.username === username);

    if (usernameIndex === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    req.usernameIndex = usernameIndex;
    next();
};

export { validateRequest, GetProductByQueryParams, GetUserByQueryParams };