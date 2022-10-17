import bcrypt from 'bcrypt'

export function hash(text, saltRounds=10) {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(text, salt)
}

export function checkPassword(password, user){
    return bcrypt.compareSync(password, user.password)
}