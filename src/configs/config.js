
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const SERVER = process.env.SERVER
const PORT = process.env.PORT
const CLIENT = process.env.CLIENT
const DB_SERVER = process.env.DB_SERVER
const UPLOAD_FOLDER = path.join(process.cwd(), 'upload')
const IMGS_UPLOAD_FOLDER = path.join(UPLOAD_FOLDER, "imgs");

export {
    SERVER,
    PORT,
    CLIENT,
    DB_SERVER,
    UPLOAD_FOLDER,
    IMGS_UPLOAD_FOLDER
}