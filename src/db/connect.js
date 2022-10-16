import { success, error, line } from "../helpers/print.js";
import mongoose from "mongoose";
import {dbConfig} from '../configs/config.js'

const { host, port, database } = dbConfig;
const URI = `mongodb://${host}:${port}/${database}`;

try {
  await mongoose.connect(URI);
  success("Conectado ao banco com sucesso");

} catch (e) {
    error('Erro ao conectar ao banco de dados')

}

export default mongoose
