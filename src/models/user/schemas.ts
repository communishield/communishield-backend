import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("hashedPassword")) {
    next();
    return;
  }

  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  next();
});

export { userSchema };
