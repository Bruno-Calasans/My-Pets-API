import path from 'path'
import multer from 'multer'
import { randomInt } from 'crypto'

const imageStorage = multer.diskStorage({
    
    destination: (req, file, cb) => {

        let folder = ""

        if(req.baseUrl.includes('user')) {
            folder = '/user'

        }else if (req.baseUrl.includes('pet')){
            folder = '/pet'
        }

        cb(null,  path.join(process.cwd(), 'public', 'imgs', folder))
    },
    filename: (req, file, cb) => {
        // evitar arquivos sejam salvos com mesmo nome
        const name = Date.now() + randomInt(0, 10000) + path.extname(file.originalname)
        cb(null, name)

    }
})

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {

        if(!file.originalname.match(/\.(png|jpg)$/)) {
            cb(new Error("The permitted extensions are .jpg or .png"), false)
            return
        }

        cb(null, true)
    }
})

export default uploadImage
