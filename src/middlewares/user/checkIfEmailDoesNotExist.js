
import User from "../../models/user.model.js"

export default async function checkIfEmailDoesNotExist(req, res, next) {

    // validando email
    const currentUser = res.locals.user
    const foundUser = await User.findOne({email: req.body.email})

    if(foundUser && currentUser.email != foundUser.email) {
       return res
         .status(400)
         .json({ error: true, message: "This email is already in use" });
    }

    next()
 
}