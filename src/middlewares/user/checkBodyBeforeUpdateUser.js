
import { checkSchema, matchedData } from "express-validator";
import { regexFilePath, regexPhone } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from "../../helpers/bodyValidator.js";
import clearImages from "../../helpers/clearImages.js";

const userUpdateSchema = {
  firstName: {
    notEmpty: { errorMessage: "First Name can't be empty" },
    isAlpha: { errorMessage: "First Name must be alphabetic" },
    isLength: {
      options: { min: 3 },
      errorMessage: "First Name must have 3 or more caracteres",
    },
    optional: true,
  },
  lastName: {
    notEmpty: { errorMessage: "Last Name can't be empty" },
    isAlpha: { errorMessage: "Last Name must be alphabetic" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Last Name must have 3 or more 3 caracteres",
    },
    optional: true,
  },
  email: {
    notEmpty: { errorMessage: "Email can't be empty" },
    isEmail: { errorMessage: "Invalid email" },
    optional: true,
  },
  password: {
    notEmpty: { errorMessage: "Password can't be empty" },
    isString: { errorMessage: "Password must be a string" },
    isLength: {
      errorMessage: "Password must have 8 or more characteres",
      options: { min: 8 },
    },
    optional: true,
  },
  confirmationPassword: {
    notEmpty: { errorMessage: "Confirmation password can't be empty" },
    isString: { errorMessage: "Confirmation password must be a string" },
    isLength: {
      errorMessage: "Password must have 8 or more characteres",
      options: { min: 8 },
    },
    optional: true,
  },
  image: {
    notEmpty: { errorMessage: "Image can't be empty" },
    custom: {
      options: (value) => {
        return regexFilePath.test(value);
      },
      errorMessage: "Invalid image path",
    },
    optional: true,
  },
  phone: {
    notEmpty: { errorMessage: "Phone can't be empty" },
    custom: {
      options: (value) => {
        return regexPhone.test(value);
      },
      errorMessage:
        "Invalid phone number. Must be this pattern (xx) x xxxx xxxx",
    },
    optional: true,
  },
};

// check if body data is valid
export default async function checkBodyBeforeUpdateUser(req, res, next) {

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  // validando body
  const results = await checkSchema(userUpdateSchema, ["body"]).run(req);
  const errors = getErrorsFromResult(results);

  if (errors.length > 0) {
    clearImages([req.file.fileName], 'user');
    return res.status(400).json({
      error: true,
      message: errors[0].msg,
      errors,
    });
  }

  // deixando apenas os campos válidos
  req.body = matchedData(req, { onlyValidData: true, locations: ["body"] });

  // verificando se os campos estão vazios depois da sanitização
  if (objIsEmpty(req.body)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid fields were sent" });
  }

  next();
}
