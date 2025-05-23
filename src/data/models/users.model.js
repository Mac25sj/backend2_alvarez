import { Schema, model } from "mongoose";

const collection = "users";
const schema = new Schema(
  {
      first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }, 
    cart: { type: Schema.Types.ObjectId, ref: "Carts" }, 
    role: { type: String, default: "user" }
  },
  { timestamps: true }
);

const User = model(collection, schema);
export default User;
