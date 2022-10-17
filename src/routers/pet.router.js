

import express from 'express'
import PetController from '../controllers/pet.controller.js';

// pet middlewares
import authUser from '../middlewares/user/authUser.js'
import checkIfPetExists from '../middlewares/pet/checkIfPetExists.js';
import checkBodyBeforeRegisterPet from '../middlewares/pet/checkBodyBeforeRegisterPet.js';
import uploadHandler from '../middlewares/uploadHandler.js';
import checkBodyBeforeUpdatePet from '../middlewares/pet/checkBodyBeforeUpdatePet.js';

// adoption middlewares
import checkIfUserOwnsPet from '../middlewares/pet/checkIfUserOwnsPet.js';
import checkIfUserDoesNotOwnPet from './../middlewares/pet/checkIfUserDoesNotOwnPet.js';
import checkAdoptionStatus from '../middlewares/pet/checkAdoptionStatus.js';
import checkIfPetHasAdopter from '../middlewares/pet/checkIfPetHasAdopter.js';

const router = express.Router()

router.get('/', PetController.getAllPets)

router.get("/mypets", authUser, PetController.getAllPetsFromUser);
router.get("/info/:id", checkIfPetExists, PetController.getPetById);

router.post(
  "/register",
  authUser,
  uploadHandler('multiple', 'images'),
  checkBodyBeforeRegisterPet,
  PetController.register
);

router.patch(
  "/edit/:id",
  authUser,
  checkIfPetExists,
  checkIfUserOwnsPet,
  uploadHandler('multiple', 'images'),
  checkBodyBeforeUpdatePet,
  checkAdoptionStatus(
    "going", 
    "Edição falhou pois já está em processo de adoção"),
  checkAdoptionStatus(
    "finished",
    "Edição falhou pois a adoção já foi concluída"
  ),
  checkAdoptionStatus(
    "returning",
    "Edição falhou pois adoção está em processo de devolução"
  ),
  PetController.edit
);

router.delete(
  "/delete/:id",
  authUser,
  checkIfPetExists,
  checkIfUserOwnsPet,
  checkAdoptionStatus(
    "going", 
    "Exclusão falhou pois já está em processo de adoção"),
  checkAdoptionStatus(
    "finished",
    "Exclusão falhou pois a adoção já foi concluída"
  ),
  checkAdoptionStatus(
    "returning",
    "Exclusão falhou pois adoção está em processo de devolução"
  ),
  PetController.removePetById
);

router.get(
  "/myadoptions",
  authUser,
  PetController.getMyAdoptions
);

router.patch(
  "/adoption/schedule/:id",
  authUser,
  checkIfPetExists,
  checkIfUserDoesNotOwnPet,
  checkAdoptionStatus(
    "going", 
    "Agendamento falhou pois já foi feito"),
  checkAdoptionStatus(
    "finished",
    "Agendamento falhou pois a adoção já foi concluída"
  ),
  checkAdoptionStatus(
    "returning",
    "Agendamento falhou pois adoção está em processo de devolução"
  ),
  PetController.scheduleAdoption
);

router.patch(
  "/adoption/cancel/:id",
  authUser,
  checkIfPetExists,
  checkIfPetHasAdopter,
  checkAdoptionStatus(
    "none",
    "Cancelamento falhou pois a adoção ainda não foi iniciada"
  ),
  checkAdoptionStatus(
    "cancelled", 
    "Cancelamento falhou pois adoção já foi cancelada"),
  checkAdoptionStatus(
    "returned",
    "Cancelamento falhou pois o pet já foi devolvido"
  ),
  PetController.cancelAdoption
);

router.patch(
  "/adoption/finish/:id",
  authUser,
  checkIfPetExists,
  checkIfUserOwnsPet,
  checkIfPetHasAdopter,
  checkAdoptionStatus(
    "none",
    "Conclusão da adoção falhou pois ainda não foi iniciada"
  ),
  checkAdoptionStatus(
    "finished",
    "Conclusão da adoção falhou pois já foi finalizada"
  ),
  checkAdoptionStatus(
    "cancelled",
    "Conclusão da adoção falhou pois já foi cancelada"
  ),
  checkAdoptionStatus(
    "returning",
    "Conclusão da adoção falhou pois está em processo de devolução"
  ),
  checkAdoptionStatus(
    "returned",
    "Conclusão da adoção falhou pois o pet já foi devolvido"
  ),
  PetController.finishAdoption
);

router.patch(
  "/return/start/:id",
  authUser,
  checkIfPetExists,
  checkIfPetHasAdopter,
  checkAdoptionStatus(
    "none",
    "Inicialização da devolução falhou falhou pois a adoção ainda não foi feita"
  ),
  checkAdoptionStatus(
    "cancelled",
    "Inicialização da devolução  falhou pois já foi cancelada"
  ),
  checkAdoptionStatus(
    "returning",
    "Inicialização da devolução falhou pois já foi iniciada"
  ),
  checkAdoptionStatus(
    "returned",
    "Inicialização da devolução falhou pois já foi concluída"
  ),
  PetController.startReturn
);

router.patch(
  "/return/finish/:id",
  authUser,
  checkIfPetExists,
  checkIfPetHasAdopter,
  checkAdoptionStatus(
    "none",
    "Conclusão da devolução falhou pois a adoção ainda não foi feita"
  ),
  checkAdoptionStatus(
    "cancelled",
    "Conclusão da devolução falhou pois foi cancelada"
  ),
  checkAdoptionStatus(
    "returned",
    "Conclusão da devolução falhou pois já foi finalizada"
  ),
  PetController.finishReturn
);

router.patch(
  "/return/cancel/:id",
  authUser,
  checkIfPetExists,
  checkIfPetHasAdopter,
  checkAdoptionStatus(
    "none",
    "Cancelamento da de devolução falhou pois a adoção ainda não foi iniciada"
  ),
  checkAdoptionStatus(
    "going",
    "Cancelamento da de devolução falhou pois a adoção ainda está em andamento"
  ),
  checkAdoptionStatus(
    "cancelled",
    "Cancelamento da de devolução falhou pois já foi cancelada"
  ),
  checkAdoptionStatus(
    "returned",
    "Cancelamento da de devolução falhou pois o pet já foi devolvido"
  ),
  PetController.cancelAdoption
);

router.use((err, req, res, next) => {

  if (err) {
    console.log(err);
    res.status(500).send({ error: true, message: "Something went wrong" });
  }

})

export default router

