
import uploadImage from './../helpers/upload.js';

function uploadErrorHandler(e) {

    if (err instanceof multer.MulterError) {
        return res.json({error: true, message: 'Something went wrong to upload'})

    } else if (err) {
        return res.json({error: true, message: 'Unknown Error'})
    }
}

    
function createBodyFields(req, res, next) {

    if(req.file){
        req.body.image = req.file.filename
    }

    if(req.files && req.files?.length > 0) {
        req.body.images = req.files.map(file => file.filename)
    }

    next()
}

function main(type, fieldName) {

    if(type && fieldName) {

        if(type === 'single') {
            var uploadHandler = uploadImage.single(fieldName)
          
        }else if (type === 'multiple') {
           var uploadHandler = uploadImage.array(fieldName) 
        }

        return [uploadHandler, createBodyFields]
    }

    next()
}

export default main





