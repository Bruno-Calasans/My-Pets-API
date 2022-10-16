
import { checkPassword } from "../../helpers/hash.js"

export default async function checkIfPasswordIsValid(req, res, next) {

    const user = res.locals.user
    const password = req.body.password

    // validando senha
    const passwordValidation = checkPassword(password, user)

    if(!passwordValidation) {
       return res.status(400).json({error: true, message: "Senha inválida"})
    }
 
    next()

}

