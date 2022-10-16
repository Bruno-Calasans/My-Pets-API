
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.secret

export function createUserToken(user) {

    try {
        return jwt.sign({_id: user._id}, secret, {expiresIn: '1d'})

    }catch(e){
        return {name: e.name, message: e.message}
    }

}

export function getToken(req) {

    const authorization = req.headers.authorization

    if(authorization) {

        const token = authorization.split(' ')
        if(token.length != 2){ return false }

        return token[1]
    }

    return null
}

export function checkUserToken(token) {

    try {
        return jwt.verify(token, secret, { maxAge: "1d" });

    }catch(e) {
        console.log(e.name, e.message);
        return false
    }
   
}




