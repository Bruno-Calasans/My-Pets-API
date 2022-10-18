
import { checkSchema, matchedData} from 'express-validator'
import { regexFilePath, regexAlphaAccent } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from '../../helpers/bodyValidator.js'
import clearImages from '../../helpers/clearImages.js';


 // verificando campos
 const registerPetSchema = {
   name: {
     exists: { errorMessage: "Campo name não existe" },
     notEmpty: { errorMessage: "Nome é obrigatório" },
     isLength: {
       options: { min: 3, max: 30 },
       errorMessage: "Nome deve ter entre 3 e 30 caracteres",
     },
     custom: {
      options: (name) => {
        return  name.match(regexAlphaAccent);
      },
      errorMessage: "Nome deve ser alfabético"}
    },
   age: {
     exists: { errorMessage: "Campo age não existe" },
     notEmpty: { errorMessage: "Idade é obrigatório" },
     isFloat: { errorMessage: "Idade deve ser um número" },
   },
   weight: {
     exists: { errorMessage: "Campo weight não existe" },
     notEmpty: { errorMessage: "Peso é obrigatório" },
     isFloat: { errorMessage: "Peso deve ser um número" },
   },
   color: {
     exists: { errorMessage: "Campo color não existe" },
     notEmpty: { errorMessage: "Cor é obrigatório" },
     isAlpha: { errorMessage: "Cor deve ser alfabética" },
   },
   description: {
    notEmpty: { errorMessage: "Descrição não pode estar vazia" },
    isString: {errorMessage: "Description deve ser string"},
    optional: true
    },
   images: {
     exists: { errorMessage: "Você deve enviar uma ou várias imagens" },
     notEmpty: { errorMessage: "Você deve enviar uma imagem" },
     isArray: {
       errorMessage: "Campo images deve ser um array de imagens",
       options: {
         errorMessage: "Você deve enviar entre 1 a 4 imagens",
         min: 1,
         max: 4
       },
     },
     custom: {
       options: (array) => {
         for (let image of array) {
           return regexFilePath.test(image);
         }
       },
       errorMessage: "Cada imagem deve ser o nome dela com a extensão",
     },
   },
 };
 
// check if body data is valid
export default async function checkBodyBeforeRegisterPet(req, res, next) {

  // console.log('Nome válido:', regexAlphaAccent.test(req.body.name));

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  // validando body
  const results = await checkSchema(registerPetSchema, ['body']).run(req)
  const errors = getErrorsFromResult(results)

  if (errors.length > 0) {
    if(req.body.images){ clearImages(req.body.images, 'pet') }
    return res.status(400).json({
      error: true,
      message: errors[0].msg,
      errors
    });
  }

  // deixando apenas os campos válidos
  req.body = matchedData(req, { onlyValidData: true, locations: ["body"] });

  // verificando se os campos estão vazios depois da sanitização
  if (objIsEmpty(req.body)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid field(s) were sent" });
  }

  next();

}
