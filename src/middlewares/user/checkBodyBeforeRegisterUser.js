
import { checkSchema, matchedData } from 'express-validator'
import { regexFilePath, regexPhone } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from "../../helpers/bodyValidator.js";

const registerUserSchema = {
  firstName: {
    exists: { errorMessage: "Campo firstName não existe" },
    notEmpty: { errorMessage: "Primeiro nome é obrigatório" },
    isAlpha: { errorMessage: "Primeiro nome deve ser alfabético" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Primeiro nome deve ter 3 ou mais caracteres",
    },
  },
  lastName: {
    exists: { errorMessage: "Campo lastName não existe" },
    notEmpty: { errorMessage: "Sobrenome é obrigatório" },
    isAlpha: { errorMessage: "Sobrenome deve ser alfabético" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Sobrenome deve ter 3 ou mais caracteres",
    },
  },
  email: {
    exists: { errorMessage: "Campo email não existe" },
    notEmpty: { errorMessage: "Email é obrigatório" },
    isEmail: { errorMessage: "Email inválido" },
  },
  password: {
    exists: { errorMessage: "Capo password não existe" },
    notEmpty: { errorMessage: "Senha é obrigatório" },
    isString: { errorMessage: "Senha deve ser uma string" },
    isLength: {
      errorMessage: "Senha deve ter 8 ou mais caracteres",
      options: { min: 8 },
    },
  },
  confirmationPassword: {
    exists: { errorMessage: "Campo confirmationPassword não existe" },
    notEmpty: { errorMessage: "Confirmação de senha é obrigatório" },
    isString: { errorMessage: "Confirmação de senha deve ser uma string" },
    isLength: {
      errorMessage: "Confirmação de senha deve ter 8 ou mais caracteres",
      options: { min: 8 },
    },
  },
  image: {
    // notEmpty: { errorMessage: "Confirmação de senha é obrigatório" },
    custom: {
      options: (value) => {
        return regexFilePath.test(value);
      },
      errorMessage: "Nome de image inválido",
    },
    optional: true,
  },
  phone: {
    exists: { errorMessage: "Campo phone não existe" },
    notEmpty: { errorMessage: "Número de celular é obrigatório" },
    custom: {
      options: (value) => {
        return regexPhone.test(value);
      },
      errorMessage: "Formato de número de celular inválido",
    },
  },
};


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
