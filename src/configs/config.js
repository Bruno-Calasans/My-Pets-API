
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const DB_SERVER = process.env.DB_SERVER
const UPLOAD_FOLDER = path.join(process.cwd(), 'upload')
const IMGS_UPLOAD_FOLDER = path.join(UPLOAD_FOLDER, "imgs");
const serverConfig = JSON.parse(process.env.serverConfig)

export {
    DB_SERVER,
    serverConfig,
    UPLOAD_FOLDER,
    IMGS_UPLOAD_FOLDER
}