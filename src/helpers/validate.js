
// error format
//  { message: 'Validation failed',
//  name: 'ValidationError',
//  errors:
//   { size:
//      { message: 'must be less than 20',
//        name: 'ValidatorError',
//        path: 'size',
//        type: 'user defined',
//        value: 14 } } }
// })

export async function getErrors(e){


    if(e.__proto__.name === 'StrictModeError') {
        return e.message

    }else if(e.__proto__.name == 'ValidationError') {
    
        const errors = []

        // path as field of a collection
        for(let path in e.errors) {
            errors.push(e.errors[path].properties)
        }

        return errors
    }
}

export async function validateData(model, data){

    if(!model || !data){ return null }
    
    try {
        await model.validate(data)
        return true

    }catch(e){
        return await getErrors(e)
    }
}



