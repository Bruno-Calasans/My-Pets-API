

export default  function checkAdoptionStatus(requiredStatus="none", errorMsg=''){
    return (req, res, next) => {

        const pet = res.locals.pet
    
        // if pet is avaliabe to adoption
        if(pet.adoption.status === requiredStatus) {
            return res.status(400).json({
              error: true,
              message: errorMsg,
            });
        }
    
        next()
    }
}