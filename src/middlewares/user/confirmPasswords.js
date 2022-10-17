import { hash } from "../../helpers/hash.js"

export default async function confirmPasswords(req, res, next) {

  const { password, confirmationPassword } =  req.body

  if(!password && !confirmationPassword){ 
    return next() 
  }

  if(password && !confirmationPassword){ 
    return res
      .status(400)
      .json({
        error: true,
        message: "You must provide a confirmation password",
      });
  }

  if(!password && confirmationPassword){ 
    return res
      .status(400)
      .json({ error: true, message: "You must provide a password" });
  }
       
  // passwords validation
  if(password != confirmationPassword) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Senhas não conferem",
      });
  }

  delete req.body.confirmationPassword
  req.body.password = hash(password)
  next()
}

