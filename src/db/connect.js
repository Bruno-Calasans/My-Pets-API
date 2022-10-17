
import { success, error } from "../helpers/print.js";
import mongoose from "mongoose";
import { DB_SERVER } from "../configs/config.js";

try {
  mongoose.connect(DB_SERVER);
  success("Conectado ao banco com sucesso");
} catch (e) {
  error("Erro ao conectar ao banco de dados");
}

export default mongoose

