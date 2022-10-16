
export default function checkIfPetIsAvaliableToAdoption(req, res, next) {

    const pet = res.locals.pet

    // if pet is avaliabe to adoption
    if(!pet.adoption.status === 0) {
        return res.json({
          error: true,
          message: "This pet is not avaliable to adoption",
        });
    }

    next()
}