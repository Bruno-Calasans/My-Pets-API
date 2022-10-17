
import path from 'path'
import multer from 'multer'
import { randomInt } from 'crypto'
import { IMGS_UPLOAD_FOLDER } from '../configs/config.js'

const imageStorage = multer.diskStorage({
    
    destination: (req, file, cb) => {

        let folder = ""

        if(req.baseUrl.includes('user')) {
            folder = 'user'

        }else if (req.baseUrl.includes('pet')){
            folder = 'pet'
        }

        cb(null,  path.join(IMGS_UPLOAD_FOLDER , folder))
    },
    filename: (req, file, cb) => {
        // evitar arquivos sejam salvos com mesmo nome
        const name =
          Date.now() + randomInt(0, 10000) + path.extname(file.originalname);
        cb(null, name)

    }
})

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {

        if(!file.originalname.match(/\.(png|jpg)$/)) {
            cb(new Error("As exntesões permitidas são .jpg or .png"), false)
            return
        }

        cb(null, true)
    }
})

export default uploadImage
