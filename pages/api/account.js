import User from "../../models/User";
import jwt from "jsonwebtoken";

import connectDb from "../../utils/connectDb";

connectDb();

export default async function Account(req, res) {
  if (req.method !== "GET") {
    return res.status(422).send({
      status: "fail",
      message: `${req.method} method is not allowed on this route!`,
    });
  }
  try {
    if (req.headers.authorization) {
      const { _id } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      const user = await User.findOne({ _id: _id });
      if (!user) {
        return res.status(404).send({ status: "fail" });
      } else {
        return res.status(200).send({ status: "success", user });
      }
    }
  } catch (err) {
    res.status(403).send({ status: "error", message: "Invalid token!" });
  }
}
