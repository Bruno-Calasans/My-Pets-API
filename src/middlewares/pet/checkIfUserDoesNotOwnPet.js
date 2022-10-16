

export default function checkIfUserDoesNotOwnPet(req, res, next) {
  const pet = res.locals.pet;
  const userId = res.locals.user._id;

  // verifying if current user is not the owner of the wanted pet
  if (pet.adoption?.owner._id.toString() === userId.toString()) {
    return res
      .status(403)
      .json({ error: true, message: "Você não pode adotar seu próprio pet" });
  }

  next();
}