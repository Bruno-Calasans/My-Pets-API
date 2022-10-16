
import { checkSchema, matchedData} from 'express-validator'
import { regexFilePath } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from '../../helpers/bodyValidator.js'
import clearImages from '../../helpers/clearImages.js';

 // verificando campos
 const registerPetSchema = {
   name: {
     exists: { errorMessage: "Name is required" },
     notEmpty: { errorMessage: "Name can't be empty" },
     isAlpha: { errorMessage: "Name must be alphabetic" },
     isLength: {
       options: { min: 3, max: 30 },
       errorMessage:
         "Name msut have 3 or more caracteres",
     },
   },
   age: {
     exists: { errorMessage: "Age is required" },
     notEmpty: { errorMessage: "Age can't be empty" },
     isFloat: { errorMessage: "Age must be a number" },
   },
   weight: {
     exists: { errorMessage: "Weight is required" },
     notEmpty: { errorMessage: "Weight can't be empty" },
     isFloat: { errorMessage: "Must be a number" },
   },
   color: {
     exists: { errorMessage: "Color is required" },
     notEmpty: { errorMessage: "Name can't be empty" },
     isAlpha: { errorMessage: "Color must be alphabetic" },
   },
   images: {
     exists: { errorMessage: "Images are required" },
     notEmpty: { errorMessage: "Images can't be empty" },
     isArray: {
       errorMessage: "Images must be a array of images",
       options: { errorMessage: "Image must have at least 1 image", min: 1 },
     },
     custom: {
       options: (array) => {
         for (let image of array) {
            return regexFilePath.test(image);
            // if (!result) { return false }
         }
       },
       errorMessage: "Each image name must be a string",
     },
   },
 };
 
// check if body data is valid
export default async function checkBodyBeforeRegisterPet(req, res, next) {

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }

  // validando body
  const results = await checkSchema(registerPetSchema, ['body']).run(req)
  const errors = getErrorsFromResult(results)

  if (errors.length > 0) {
    const filenames = req.files.map(file => file.filename)
    clearImages(filenames, 'pet')
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
