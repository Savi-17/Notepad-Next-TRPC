import { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
