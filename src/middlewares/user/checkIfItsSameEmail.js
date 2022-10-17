
import User from "../../models/user.model.js";

export default async function  checkIfItsSameEmail(req, res, next){

  const currentUser = res.locals.user;
  const foundUser = await User.findOne({ email: req.body.email });

  if (foundUser && currentUser._id.toString() != foundUser._id.toString()) {
    return res
      .status(400)
      .json({ error: true, message: "Este email já está em uso" });
  }

  next();

}