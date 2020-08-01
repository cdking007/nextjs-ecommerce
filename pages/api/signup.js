import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import validator from "validator";

connectDb();

export default async function Signup(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({
      status: "fail",
      message: `${req.method} method is not allowed in this route!`,
    });
  }
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(422)
        .send({ status: "fail", message: "all fields are required!" });
    }

    if (!validator.isLength(name, { min: 3, max: 15 })) {
      return res.status(422).send({
        status: "fail",
        message: "Name character must be between 3 to 15!",
      });
    } else if (!validator.isLength(password, { min: 6 })) {
      return res.status(422).send({
        status: "fail",
        message: "password must be 6 character long!",
      });
    } else if (!validator.isEmail(email)) {
      return res
        .status(422)
        .send({ status: "fail", message: "Email must be valid!" });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(422).send({
        status: "fail",
        message: "User already exist with this email!",
      });
    }
    const user = new User({
      name,
      email,
      password,
    });
    await user.save();
    // creating initial cart for the new signed up user;
    await new Cart({ user: user._id }).save();

    // genetating the auth toke from the jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    return res.status(201).send({ status: "success", user, token });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: "error", message: "something went wrong!" });
  }
}
