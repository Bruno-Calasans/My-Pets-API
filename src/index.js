
// express
import express from 'express'
import { serverConfig } from './configs/config.js'

// helpers
import { line, warn } from "./helpers/print.js";

// middlewares
import cors from 'cors'

// routers
import userRouter from './routers/user.router.js'
import petRouter from './routers/pet.router.js'

// app principal
const app = express()

// configurando arquivos estáticos
app.use('/upload', express.static('./upload'))

// body parser
app.use(express.json())

// configurando CORS
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:3000' // front end
}))

// roteamento
app.get('/', (req, res) => {
    res.send('Olá')
})
 
app.use('/user', userRouter)
app.use('/pet', petRouter)

// incianto servidor
const  {hostname, port} = serverConfig
app.listen(port, hostname, () => {
    warn(`Servidor inciado em http://${hostname}:${port}`)
})
