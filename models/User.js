import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      lowercase: true,
      unique: [true, "Email is already in use!"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Email is required!"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
      required: true,
      enum: ["user", "admin", "root"],
    },
  },
  { timestamps: true }
);

// Hashing the password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 8);
  this.password = hashedPassword;
  next();
});

// // Deleting the password before sending it to the json response!
// userSchema.methods.toJson = function () {
//   const user = this;
//   const userObj = user.toObject();
//   delete userObj.password;
//   return userObj;
// };

export default mongoose.models.User || mongoose.model("User", userSchema);
