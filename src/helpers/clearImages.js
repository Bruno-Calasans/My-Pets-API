
import fs from 'fs'
import path from 'path'
import { IMGS_UPLOAD_FOLDER } from '../configs/config.js'

export default function clearImages(filenames = [], folder='pet'){

    for (let filename of filenames) {

        const filePath = path.join(IMGS_UPLOAD_FOLDER, folder, filename)

        try {
            fs.existsSync(filePath) 
            
        } catch (e) {
            return null
        }

        try {
            fs.rmSync(filePath);

        }catch(e) {
            return false
        }
    }
}

