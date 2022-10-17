
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const TOKEN_SECRET = process.env.TOKEN_SECRET

export function createUserToken(user) {

    try {
        return jwt.sign({_id: user._id}, TOKEN_SECRET, {expiresIn: '1d'})

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
        return jwt.verify(token, TOKEN_SECRET, { maxAge: "1d" });

    }catch(e) {
        console.log(e.name, e.message);
        return false
    }
   
}




