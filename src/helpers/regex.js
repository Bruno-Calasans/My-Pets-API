
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const regexFilePath = /^(.+)\/([^\/]+)|(.+\.[a-z]{3})?$/g
const regexPhone = /^\s*(\d{2}|\d{0})[-. ]?\s?9\s?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/


export {
    regexEmail, 
    regexFilePath,
    regexPhone
}

