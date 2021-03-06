import * as restify from 'restify'

export const handleError = (_req: restify.Request, _res: restify.Response, err, done) => {
    //console.log(err)
    err.toJSON = () => { 
        return { message : err.message } 
    }

    switch (err.name) {
        case 'MongoError':
            if(err.code === 11000) err.statusCode = 400
            break;
    
        case 'ValidationError':
            err.statusCode = 400
            const messages: any[] = []
            for (let name in err.errors) {
                messages.push({message: err.errors[name].message}) 
            }
            err.toJSON = () => ({
              message: 'validation error while processing your request',
							errors: messages 
            })
            break;
    }
    done()
}