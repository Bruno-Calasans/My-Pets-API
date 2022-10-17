
import User from "../../models/user.model.js"

export default async function checkIfEmailExists(req, res, next) {

    const email = req.body.email
    if(!email){ return next() }

    // validando email
    const user = await User.findOne({ email });

    if(!user) {
        return res
          .status(400)
          .json({ error: true, message: "Este email não existe" });
    }

    res.locals.user = user
    
    next()
}