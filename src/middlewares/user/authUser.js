
import User from "../../models/user.model.js";
import { getToken, checkUserToken } from "../../helpers/token.js";

export default async function authUser(req, res, next){

    const token = getToken(req)

    // não enviou o token
    if (token === null) {
      return res.status(400).json({
        error: true,
        message: "Você deve enviar um token",
      });
    }

    // enviou o token, mas de maneira errada
    if (token === false) {
      return res.status(400).json({
        error: true,
        message: "Authorization Header inválido",
      });
    }

    const payload = checkUserToken(token)
 
    // enviou um token inválido
    if (!payload) {
      return res.status(401).json({
        error: true,
        message: "Token inválido",
      });
    }

    // dados do usuário
    const id = payload._id // id dentro do token
    let user = null

    // verificando se o usuário existe
    try {

      user = await User.findById(id);

      if(!user){
        return res
          .status(400)
          .json({ error: true, message: "Usuário não encontrado" });
      }

      res.locals.user = user.confidential
      res.locals.payload = payload
      
      next()

    }
    catch(e) {
      return res
        .status(400)
        .json({ error: true, message: "ID de usuário inválido" });
    }
}
 