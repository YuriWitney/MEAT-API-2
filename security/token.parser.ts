import * as restify from "restify"
import * as jwt from "jsonwebtoken"
import { enviroment } from "../common/environment"
import { User } from "../users/users.model"

export const tokenParser: restify.RequestHandler = (req, _res, next) => {
	const token = extractToken(req)
	if(token) {
		jwt.verify(token, enviroment.security.apiSecret, applyBearer(req, next))
	} else {
		next()
	}
}

function extractToken(req: restify.Request) {
	//authorization: Bearer TOKEN_VALUE
	let token
	const authorization = req.header('authorization')
	if(authorization) {
		const parts: string[] = authorization.split(' ')
		if(parts.length === 2 && parts[0] === 'Bearer') {
			token = parts[1]
		}
	}
	return token
}

function applyBearer(req:restify.Request, next): (error, decoded) => void {
	return (_error, decoded) => {
		if(decoded) {
			User.findByEmail(decoded.sub).then(user => {
				if(user) {
					//associar usuário ao request
					req.authenticated = user
				}
				next()
			}).catch(next)
		} else {
			next()
		}
	}
}