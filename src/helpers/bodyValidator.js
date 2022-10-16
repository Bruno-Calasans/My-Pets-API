
export function objIsEmpty(obj){
    const objLength = Object.keys(obj).length
    return objLength === 0
}

export function getErrorsFromResult(results, onlyFirstError = true) {

    const errors = results
      .map((result) => result.array({ onlyFirstError }))
      .flat();
  
    return errors;
}
  
