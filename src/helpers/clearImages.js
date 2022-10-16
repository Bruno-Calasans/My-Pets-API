
import fs from 'fs'
import path from 'path'

export default function clearImages(names = [], folder='pet'){

    const basePath = path.join(process.cwd(), 'public', 'imgs', folder)

    for (let name of names) {

        const filePath = path.join(basePath, name)

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

