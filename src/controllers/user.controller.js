
import { warn, line } from "../helpers/print.js";
import User from "../models/user.model.js";
import { validateData, getErrors } from "../helpers/validate.js";
import { hash, checkPassword } from "../helpers/hash.js"
import { checkUserToken, createUserToken, getToken } from './../helpers/token.js';
import { isValidObjectId } from 'mongoose';
import clearImages from "../helpers/clearImages.js";

export default class UserController {
  
  static async getAll(req, res) {
    res.json({ message: "Todos os users" });
  }

  static async register(req, res) {

    const user = req.body
   
    // tentando salvar usuário
    try {
      const savedUser = await User.create(user)
      const token = createUserToken(savedUser)

      return res.json({
        message: "User created successfully",
        user: savedUser.condidential,
        token,
      });

    }catch(e){
      // console.log(e);
      return res
        .status(505)
        .json({ error: true, message: "Error to create user" });
    }

  }

  static async login(req, res) {

    const user = res.locals.user
    const token = createUserToken(user)
    res.json({ message: "Logado com sucesso", token });

  }

  // verifica autorização de um usuário
  static async checkUser(req, res) {

    const user = res.locals.user

    res.json({
      message: "Authorization successfuly",
      user: user
    })

  }

  static async getUserById(req, res) {

    const id = req.params.id

    if(!isValidObjectId(id)) {
      return res.status(400).json({ error: true, message: "Invalid ID" });
    }
    
    try {
      const user = await User.findById(id)

      if(!user){ 
        return res.json({error: true, message: "User not found" })
      }
    
      // usuário sem a senha
      res.json({ user: user.confidential });
    
    }
    catch(e){
      res.status(500).json({ error: true, message: "Error to find the user" });
    }
   
  }

  static async editUser(req, res) {

    // dados do usuário
    const id = res.locals.payload._id
    const previousUser = res.locals.user

    // clearing the old image file
    if(req.body.image) {
      clearImages([previousUser.image], 'user');
    }

    // tentando atualizar o usuário
    try {

      await User.findByIdAndUpdate(id, req.body)
      const updatedUser = await User.findById(id);
      updatedUser.save()

      return res.status(201).json({
        message: "Update successfully",
        previousUser,
        updatedUser: updatedUser.confidential,
      });
    
    }
    catch(e){
      res.status(500).json({
        message: "Update failed",
        error: await getErrors(e)
      });
      
    }

  }

}
