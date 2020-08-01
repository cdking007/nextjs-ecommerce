import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDb from "../../utils/connectDb";
import Cart from "../../models/Cart";

connectDb();
const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      handleGetRequest(req, res);
      break;
    case "PUT":
      handlePutRequest(req, res);
      break;
    case "DELETE":
      handleRemoveItemFromCart(req, res);
      break;
    default:
      res.status(422).send({
        status: "fail",
        message: `${req.method} method is not allowed on this route!`,
      });
      break;
  }
};

export async function handleGetRequest(req, res) {
  if (req.headers.authorization) {
    console.log("we are inside");
    const { _id } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    try {
      const cart = await Cart.findOne({ user: _id }).populate({
        path: "products.product",
        model: "Product",
      });
      return res.status(200).send({ status: "success", cart: cart.products });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "error", message: "Something went wrong!" });
    }
  }
}

export async function handlePutRequest(req, res) {
  if (req.headers.authorization) {
    const { _id } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const { quntity, productId } = req.body;
    try {
      const cart = await Cart.findOne({ user: _id });
      const productExist = cart.products.some((product) =>
        ObjectId(productId).equals(product.product)
      );

      if (productExist) {
        await Cart.findOneAndUpdate(
          { _id: cart._id, "products.product": productId },
          { $inc: { "products.$.quntity": quntity } }
        );
      } else {
        const newProduct = { quntity, product: productId };
        await Cart.findOneAndUpdate(
          { _id: cart._id },
          { $addToSet: { products: newProduct } }
        );
      }
      res.status(201).send({ status: "success", message: "cart updated!" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: "error", message: "Something went wrong!" });
    }
  }
  return res
    .status(400)
    .send({ status: "fail", message: "Auth token is missing!" });
}

export async function handleRemoveItemFromCart(req, res) {
  if (req.headers.authorization) {
    try {
      const { productId } = req.query;
      const { _id } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      const updatedProducts = await Cart.findOneAndUpdate(
        { user: _id },
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate({ path: "products.product", model: "Product" });

      console.log(updatedProducts);
      return res
        .status(200)
        .send({ status: "success", products: updatedProducts.products });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: "error", message: "something is wrong!" });
    }
  } else {
    return res
      .status(400)
      .send({ status: "fail", message: "no auth token found!" });
  }
}
