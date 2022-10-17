
import { checkSchema, matchedData } from "express-validator";
import { objIsEmpty, getErrorsFromResult } from '../../helpers/bodyValidator.js';

const loginSchema = {
    email: {
      exists: { errorMessage: "Campo email não existe" },
      notEmpty: {errorMessage : "Email obrigatório"},
      isEmail: { errorMessage: "Email inválido" },
    },
    password: {
      exists: { errorMessage: "Campo password não existe" },
      notEmpty: {errorMessage : "Senha é obrigatório"},
      isString: { errorMessage: "Senha deve ser um string" },
      isLength: {
        errorMessage: "Senha deve ter 8 ou mais caracteres",
        options: { min: 8 },
      },
    },
}

// check if body data is valid
export default async function checkBodyBeforeLogin(req, res, next) {

    // body vazio
    if(objIsEmpty(req.body)){
        return res.status(400).json({ error: true, message: "Body is empty" });
    }

    // validando body da requisição
    const results = await checkSchema(loginSchema, ['body']).run(req)
    const errors = getErrorsFromResult(results)

    if(errors.length > 0) {
        return res
          .status(400)
          .json({
            error: true,
            message: errors[0].msg,
            errors,
        });
    }

    // deixando apenas os campos válidos
    req.body = matchedData(req, { onlyValidData: true, locations: ['body'] })

    // verificando se os campos estão vazios depois da sanitização do body
    if(objIsEmpty(req.body)){
        return res
          .status(400)
          .json({ error: true, message: "Campos inválidos foram enviados" });
    }

    next()

}
