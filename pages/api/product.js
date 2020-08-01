import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      handleGetRequest(req, res);
      break;
    case "POST":
      handlePostRequest(req, res);
      break;
    case "DELETE":
      handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`req ${req.method} not allowed`);
      break;
  }
};

// LOgics for the functions

const handleGetRequest = async (req, res) => {
  const { _id } = req.query;
  const product = await Product.findOne({ _id });
  return res.send(product);
};

const handleDeleteRequest = async (req, res) => {
  const { _id } = req.query;
  const product = await Product.findOne({ _id });
  if (!product) {
    return res.send({ status: "fail", message: "no product found!" });
  }
  await product.remove();
  return res.send({ status: "Success", product });
};

const handlePostRequest = async (req, res) => {
  try {
    const { name, price, description, mediaUrl } = req.body;

    if (!name || !price || !description || !mediaUrl) {
      return res
        .status(422)
        .send({ status: "fail", message: "All fields are requred!" });
    }

    const product = new Product({ name, price, description, mediaUrl });
    const prod = await product.save();
    if (!prod) {
      return res
        .status(200)
        .send({ status: "fail", message: "something want wrong!" });
    }
    res.status(200).send({ status: "success", product: prod });
  } catch (error) {
    res.status(500).send({ status: "fail", message: "Server is down!" });
  }
};
