
import Pet from "../models/pet.model.js";
import clearImages from "../helpers/clearImages.js";

export default class PetController {
  static async getAllPets(req, res) {
    try {
      const pets = await Pet.find();
      if (pets.length === 0) {
        return res.json({ error: true, message: "Nenhum pet encontrado" });
      }

      res.json({ pets });
    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao carregar os pets" });
    }
  }

  static async getMyAdoptions(req, res) {
    const userId = res.locals.user._id;

    try {
      const pets = await Pet.find({ "adoption.adopter._id": userId });
      res.json({ message: "Adoções carregadas com sucesso", pets });

    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao carregar adoções" });
    }
  }

  static async getPetById(req, res) {
    res.json({
      message: "Pet encontrado",
      pet: res.locals.pet,
    });
  }

  static async getAllPetsFromUser(req, res) {
    try {
      const userId = res.locals.user._id;
      const pets = await Pet.find({ "adoption.owner._id": userId });
      res.json({
        message: "Todos os pets do usuário foram carregados com sucesso",
        userId,
        pets,
      });
    } catch (e) {
      res.status(500).json({
        error: true,
        message: "Erro ao carregar pets do usuário",
      });
    }
  }

  static async removePetById(req, res) {
    const pet = res.locals.pet;

    // trying to delete the pet
    try {
      clearImages(pet.images)
      await Pet.findByIdAndDelete(pet._id);

      res.json({
        pet,
        message: "Pet deletado com sucesso",
      });

      // we couldn't delete the pet
    } catch (e) {
      res.status(500).json({ error: true, message: "Erro ao deletar pet" });
    }
  }

  static async register(req, res) {
    const pet = req.body;
    const user = res.locals.user;
    pet.adoption = {
      owner: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    };

    try {
      const registeredPet = await Pet.create(pet);
      registeredPet.save();

      res.json({
        message: "O pet foi cadastrado com sucesso",
        pet: registeredPet,
      });
    } catch (e) {
      res.status(500).json({ error: true, message: "Erro ao cadastrar pet" });
    }
  }

  static async edit(req, res) {
    const id = req.params.id;

    try {
      await Pet.findByIdAndUpdate(id, req.body).then((updatedPet) =>
        updatedPet.save()
      );

      res.json({
        message: "O pet foi atualizado com sucesso",
        previousPet: res.locals.pet,
        currentPet: await Pet.findById(id),
      });
    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao atualizar pet :(" });
    }
  }

  static async scheduleAdoption(req, res) {
    const adopter = res.locals.user;
    const pet = res.locals.pet;

    try {
      const adoptedPet = await Pet.findByIdAndUpdate(
        pet._id,
        {
          "adoption.status": "going",
          "adoption.adopter": {
            _id: adopter._id,
            firstName: adopter.firstName,
            lastName: adopter.lastName,
            phone: adopter.phone,
          },
        },
        { new: true }
      );

      return res.json({
        message: "Adoção agendada com sucesso",
        pet: adoptedPet,
      });

    } catch (e) {
      res.status(500).json({
        error: true,
        message: "Erro ao agendar adoção",
      });
    }
  }

  static async cancelAdoption(req, res) {

    const user = res.locals.user
    const pet = res.locals.pet;

    try {
        const cancelledPet = await pet.updateOne(
          { 
            "adoption.status": "cancelled",
            // "adoption.adopter": null
          },
          { new: true }
        );

      res.json({
        message: "Adoção foi cancelada com sucesso",
        pet: cancelledPet,
      });

    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao cancelar adoção" });
    }
  }

  static async finishAdoption(req, res) {
    const pet = res.locals.pet;

    try {
      const adoptedPet = await Pet.findByIdAndUpdate(
        pet._id,
        { "adoption.status": "finished" },
        { new: true }
      );

      res.json({
        message: "Adoção finalizada com sucesso!",
        pet: adoptedPet,
      });

    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Error ao finalizar adoção :(" });
    }
  }

  static async startReturn(req, res) {

    // const user = res.locals.user
    const pet = res.locals.pet

    try {
        const returnedPet = await pet.updateOne(
          { 
            "adoption.status": "returning",
          },
          { new: true }
        );

      res.json({
        message: "Processo de devolução iniciado com sucesso",
        pet: returnedPet,
      });

    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao iniciar devolução do pet :(" });
    }
  }

  static async finishReturn(req, res) {

    // const user = res.locals.user
    const pet = res.locals.pet;

    try {
        const returnedPet = await pet.updateOne(
          { 
            "adoption.status": "returned",
          },
          { new: true }
        );

      res.json({
        message: "Processo de devolução concluído com sucesso",
        pet: returnedPet,
      });

    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: "Erro ao concluir adoção" });
    }
  }
}
