import products from "../../public/products.json";
import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";

connectDb();

export default async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ status: "fail", message: err });
  }
};
