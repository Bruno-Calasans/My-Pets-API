
import { checkSchema, matchedData } from 'express-validator'
import { regexFilePath, regexPhone } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from "../../helpers/bodyValidator.js";

const registerUserSchema = 
  {
    firstName: {
      exists: { errorMessage: "First Name is required" },
      isAlpha: { errorMessage: "First Name must be alphabetic" },
      isLength: {
        options: { min: 3 },
        errorMessage: "First Name must have 3 or more caracteres",
      },
    },
    lastName: {
      exists: { errorMessage: "Last Name is required" },
      isAlpha: { errorMessage: "First Name must be alphabetic" },
      isLength: {
        options: { min: 3 },
        errorMessage: "Last Name must have 3 or more 3 caracteres",
      },
    },
    email: {
      exists: { errorMessage: "Email is required" },
      isEmail: { errorMessage: "Invalid email" },
    },
    password: {
      exists: { errorMessage: "Password is required" },
      isString: { errorMessage: "Password must be a string" },
      isLength: {
        errorMessage: "Password must have 8 or more characteres",
        options: { min: 8 },
      },
    },
    confirmationPassword: {
      exists: { errorMessage: "Confirmation password is required" },
      isString: { errorMessage: "Confirmation password must be a string" },
      isLength: {
        errorMessage: "Password must have 8 or more characteres",
        options: { min: 8 },
      },
    },
    image: {
      custom: {
        options: (value) => {
          return regexFilePath.test(value);
        },
        errorMessage: "Invalid image path",
      },
      optional: true,
    },
    phone: {
      exists: { errorMessage: "Phone Number is required" },
      custom: {
        options: (value) => {
          return regexPhone.test(value);
        },
        errorMessage:
          "Invalid phone number. Must be this pattern (xx) x xxxx xxxx",
      },
    }
}


// check if body data is valid
export default async function checkBodyBeforeRegisterUser(req, res, next) {

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  // verificando body
  const results = await checkSchema(registerUserSchema, ['body']).run(req)
  const errors = getErrorsFromResult(results);

  if (errors.length > 0) {
    return res.status(400).json({
      error: true,
      message:  errors[0].msg,
      errors
    });
  }

  // deixando apenas os campos válidos d obody
  req.body = matchedData(req, { onlyValidData: true, locations: ["body"] });

  // verificando se os campos estão vazios depois da sanitização
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  next();
}
