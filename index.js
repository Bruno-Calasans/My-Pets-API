
// express
import express from 'express'
import { SERVER, PORT, CLIENT } from './src/configs/config.js'

// helpers
import { warn } from "./src/helpers/print.js";

// middlewares
import cors from 'cors'

// routers
import userRouter from './src/routers/user.router.js'
import petRouter from './src/routers/pet.router.js'

// app principal
const app = express()

// configurando arquivos estáticos
app.use('/upload', express.static('./upload'))

// body parser
app.use(express.json())

// configurando CORS
app.use(cors({
    credentials: true,
    origin: CLIENT // front end
}))

// roteamento
app.get('/', (req, res) => {
    res.send('Olá')
})
 
app.use('/user', userRouter)
app.use('/pet', petRouter)

// incianto servidor

app.listen(PORT || 8000, () => {
    warn(`Servidor inciado em ${SERVER}`)
})
