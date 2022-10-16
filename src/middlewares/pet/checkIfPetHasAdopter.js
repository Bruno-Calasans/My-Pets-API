
export default function checkIfPetHasAdopter(req, res, next){

    const pet = res.locals.pet;

    // if there's an adopter
    if (!pet.adoption.adopter) {
        return res
          .status(400)
          .json({ error: true, message: "Este pet ainda não tem um adotador" });
    }

    next()
}