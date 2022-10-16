
import { checkSchema, matchedData} from 'express-validator'
import { regexFilePath } from '../../helpers/regex.js';
import { objIsEmpty, getErrorsFromResult } from '../../helpers/bodyValidator.js'
import clearImages from '../../helpers/clearImages.js';

const petUpdateSchema = {
  name: {
    notEmpty: { errorMessage: "Name can't be empty" },
    isAlpha: { errorMessage: "Name must be alphabetic" },
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage:
        "String lenght must be more or iqual to 3 AND less or igual to 30 caracteres",
    },
    optional: true,
  },
  age: {
    notEmpty: { errorMessage: "Age can't be empty" },
    isFloat: { errorMessage: "Age must be a number" },
    optional: true,
  },
  weight: {
    notEmpty: { errorMessage: "Weight can't be empty" },
    isFloat: { errorMessage: "Must be a number" },
    optional: true,
  },
  color: {
    notEmpty: { errorMessage: "Color can't be empty" },
    isAlpha: { errorMessage: "Color must be alphabetic" },
    optional: true,
  },
  images: {
    notEmpty: { errorMessage: "Images can't be empty" },
    isArray: {
      errorMessage: "Images must be a array of images",
      options: { min: 1, errorMessage: "Images must have at least 1 image" },
    },
    custom: {
      options: (array) => {
        for (let element of array) {
          return regexFilePath.test(element);
        }
      },
      errorMessage: "Each image name must be a string",
    },
    optional: true
  },
};

// check if body data is valid
export default async function checkBodyBeforeUpdatePet(req, res, next) {

  // body vazio
  if (objIsEmpty(req.body)) {
    return res.status(400).json({ error: true, message: "Body is empty" });
  }
 
  // validadn o body
  const results = await checkSchema(petUpdateSchema, ['body']).run(req)
  const errors = getErrorsFromResult(results)

  if (errors.length > 0) {
    const filenames = req.files.map(file => file.filename)
    clearImages(filenames, 'pet')
    return res.status(400).json({
      error: errors[0],
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
