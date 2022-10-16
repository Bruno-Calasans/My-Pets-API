

export default function checkIfUserOwnsPet(req, res, next) {

    const pet = res.locals.pet
    const userId = res.locals.user._id

    // verifying if current user is owner of the wanted pet
    if(pet.adoption?.owner._id.toString() != userId.toString()) {
        return res
          .status(403)
          .json({ error: true, message: "You're not the owner of this pet" });
    }
    
    next()
}