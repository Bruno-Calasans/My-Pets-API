
import { checkSchema, matchedData } from "express-validator";
import { regexFilePath, regexPhone } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from "../../helpers/bodyValidator.js";
import clearImages from "../../helpers/clearImages.js";

const userUpdateSchema = {
  firstName: {
    notEmpty: { errorMessage: "Primeiro nome é obrigatório" },
    isAlpha: { errorMessage: "Primeiro nome deve ser alfabético" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Primeiro nome deve ter 3 ou mais caracteres",
    },
    optional: true
  },
  lastName: {
    notEmpty: { errorMessage: "Sobrenome é obrigatório" },
    isAlpha: { errorMessage: "Sobrenome deve ser alfabético" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Sobrenome deve ter 3 ou mais caracteres",
    },
    optional: true
  },
  email: {
    notEmpty: { errorMessage: "Email é obrigatório" },
    isEmail: { errorMessage: "Email inválido" },
    optional: true
  },
  password: {
    notEmpty: { errorMessage: "Senha é obrigatório" },
    isString: { errorMessage: "Senha deve ser uma string" },
    isLength: {
      errorMessage: "Senha deve ter 8 ou mais caracteres",
      options: { min: 8 },
    },
    optional: true
  },
  confirmationPassword: {
    notEmpty: { errorMessage: "Confirmação de senha é obrigatório" },
    isString: { errorMessage: "Confirmação de senha deve ser uma string" },
    isLength: {
      errorMessage: "Confirmação de senha deve ter 8 ou mais caracteres",
      options: { min: 8 },
    },
    optional: true
  },
  image: {
    notEmpty: { errorMessage: "Você deve enviar uma imagem" },
    custom: {
      options: (value) => {
        return regexFilePath.test(value);
      },
      errorMessage: "Nome de imagem inválido",
    },
    optional: true,
  },
  phone: {
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
export default async function checkBodyBeforeUpdateUser(req, res, next) {

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  // validando body
  const results = await checkSchema(userUpdateSchema, ["body"]).run(req);
  const errors = getErrorsFromResult(results);


  if (errors.length > 0) {

    if(req.body.image){ clearImages([req.body.image], 'user') }
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
