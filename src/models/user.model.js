
import mongoose from "../db/connect.js";
import { Schema } from "mongoose";
import { regexEmail, regexFilePath, regexPhone } from "../helpers/regex.js";

export const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    email: {
      type: String,
      match: [regexEmail, '"{VALUE}" is not a valid email'],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minLength: 8,
      required: [true, "password is required"],
    },
    image: {
      type: String,
      match: [regexFilePath, `This "{value}" is not a valid File Path`],
      required: false
    },
    phone: {
      type: String,
      match: [regexPhone, `This "{value}" is not a valid Phone Number`],
      required: true
    }
  },
  { 
  timestamps: true, strict: 'throw', 
  virtuals: {
      confidential: {
        get() {
          const {password, ...rest} = this._doc
          return rest
        }
      }
    }
  }
);

const User = mongoose.model('user', userSchema)

export default User