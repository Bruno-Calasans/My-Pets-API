
import User from "../../models/user.model.js"

export default async function checkIfEmailDoesNotExist(req, res, next) {

    const currentUser = req.body
    // validando email
    const foundUser = await User.findOne({email: req.body.email})

    if(foundUser) {
       return res
         .status(400)
         .json({ error: true, message: "Este email já está em uso" });
    }

    next()
 
}