
import dotenv from 'dotenv'
dotenv.config()

const dbConfig = JSON.parse(process.env.dbConfig)
const serverConfig = JSON.parse(process.env.serverConfig)


export {
    dbConfig,
    serverConfig
}