import * as restify from 'restify'
import * as fs from 'fs'
import * as mongoose from 'mongoose'
import { enviroment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'
import { logger } from '../common/logger'
require('dotenv/config')

export class Server {
    application: restify.Server

    initializeDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(enviroment.db.url, {
            useMongoClient: true
        })}

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

								const options: restify.ServerOptions = {
									name:'meat-api',
	                version: '1.0.0',
									log: logger
								}
								if(enviroment.security.enableHTTPS) {
									options.certificate = fs.readFileSync(enviroment.security.certificate),
									options.key = fs.readFileSync(enviroment.security.key)
								}
                this.application = restify.createServer(options)
                
								this.application.pre(restify.plugins.requestLogger({
									log: logger
								}))

                this.application.use(restify.plugins.queryParser()) 
                this.application.use(restify.plugins.bodyParser()) 
                this.application.use(mergePatchBodyParser)
								this.application.use(tokenParser)
                
                //routes
                for (let  router of routers) router.applyRoutes(this.application)

                this.application.listen(enviroment.server.port, () => {
                    resolve(this.application) })

                this.application.on('restifyError', handleError)
								// (req, res, route, error)
								// this.application.on('after', restify.plugins.auditLogger({
								// 	log: logger,
								// 	event: 'after'
								// }))

            } catch (error) {
               reject(error) 
            }})}
    
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => 
            this.initRoutes(routers).then(() => this)) }
		shutdown() {
			return mongoose.disconnect().then(() => {
				this.application.close()
			})
		}
}