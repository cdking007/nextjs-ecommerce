import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export default async function Login(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({
      status: "fail",
      message: `${req.method} method is not allowed in this route!`,
    });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({
        status: "fail",
        message: "email and password field is required!",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(422)
        .send({ status: "fail", message: "Credential does not match!" });
    }
    console.log(user);
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(422)
        .send({ status: "fail", message: "Credential does not match!" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    return res.status(200).send({ status: "success", user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "something went wrong! we got problem please be patient",
    });
  }
}
