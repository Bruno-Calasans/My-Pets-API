

import Pet from "../../models/pet.model.js";
import { isValidObjectId } from "mongoose";

export default async function checkIfPetExists(req, res, next) {

    const petId = req.params.id

    // if id is valid
    if(!isValidObjectId(petId)) {
        return res.status(400).json({ error: true, message: "ID do Pet inválido" });
    }

    try {
        const pet = await Pet.findById(petId)

        if(!pet) {
            return res.status(404).json({error: true, message: "Pet não encontrado" });
        }

        res.locals.pet = pet
        next()

    }catch(e) {
        res.status(500).json({ error: true, message: "Erro ao encontrar o pet" });
    }

}