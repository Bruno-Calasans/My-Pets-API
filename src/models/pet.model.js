import mongoose from "../db/connect.js";
import {  Schema } from "mongoose";
import { regexFilePath } from "../helpers/regex.js";
import { regexPhone } from "../helpers/regex.js";

/*
adoption status
0 (none) -> no adoption (there's not an adopter)
1 (progress) -> on progress (there's an adopter)
2 (ok) -> conclude (owner has accepted the adoption)
3 (cancelled) -> cancelled (adopter or owner has cancelled the adoption)
*/

const adoptionStatus = [
  "none",
  "going",
  "finished",
  "cancelling",
  "cancelled",
  "returning", 
  "returned"
];

const UserContact = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
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
  phone: {
    type: String,
    match: [regexPhone, `This "{value}" is not a valid Phone Number`],
    required: true
  }
})

const adoptionSchema = new Schema({
  status: {
    type: String,
    enum: adoptionStatus,
    required: [true, "Status is required"],
    default: "none"
  },
  owner: {
    type: UserContact,
    required: [true, "Current Owner is required"],
  },
  adopter: {
    type: UserContact,
    default: null
  },
});

const petSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: [true, "Name is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    weight: {
      type: Number,
      required: [true, "Age is required"],
    },
    color: {
      type: String,
      required: [true, "Name is required"],
    },
    adoption: {
      type: adoptionSchema,
      required: true
    },
    images: {
      type: [String],
      minLength: 1,
      match: {
        value: regexFilePath,
        message: (value) => `This "${value}" is not a valid File Name`,
      },
      required: [true, "Image is required"],
    },
  },
  { timestamps: true, strict: 'throw' } 
);

const Pet = mongoose.model('pet', petSchema)

export default Pet