
import express from 'express'
import UserController from '../controllers/user.controller.js'

// middlewares
import authUser from '../middlewares/user/authUser.js'

import checkBodyBeforeRegisterUser from '../middlewares/user/checkBodyBeforeRegisterUser.js'
import checkBodyBeforeUpdateUser from '../middlewares/user/checkBodyBeforeUpdateUser.js'
import checkIfEmailExists from '../middlewares/user/checkIfEmailExists.js'
import checkIfEmailDoesNotExist from '../middlewares/user/checkIfEmailDoesNotExist.js'
import checkBodyBeforeLogin from '../middlewares/user/checkBodyBeforeLogin.js'
import checkIfPasswordIsValid from '../middlewares/user/checkIfPasswordIsValid.js'
import confirmPasswords from '../middlewares/user/confirmPasswords.js'
import uploadHandler from './../middlewares/uploadHandler.js';

const router = express.Router()

// pega todos os usuários
router.get('/', UserController.getAll) 

// pega um usuário pelo seu id
router.get('/info/:id', UserController.getUserById) 

// adiciona um novo usuário
router.post(
  "/register",
  checkBodyBeforeRegisterUser,
  checkIfEmailDoesNotExist,
  confirmPasswords,
  UserController.register
);

router.post(
  "/login",
  checkBodyBeforeLogin,
  checkIfEmailExists,
  checkIfPasswordIsValid,
  UserController.login
);

router.get(
  "/check",
  authUser,
  UserController.checkUser
); 

router.patch(
  "/edit",
  authUser,
  uploadHandler('single', 'image'),
  checkBodyBeforeUpdateUser,
  checkIfEmailDoesNotExist,
  confirmPasswords,
  UserController.editUser
); 

router.use((err, req, res, next) => {

  if(err) {
    res.status(500).send({ error: true, message: err.message});
  }

})

export default router