
import { Router } from "./router"
import * as restify from 'restify'

class MainRouter extends Router {

    showRoutes = (_req, res, _next) => {
        res.json({
            users: '/users',
            restaurants: '/restaurants',
            reviews: '/reviews'
        })
    }

    applyRoutes(application: restify.Server) {
        application.get({path: '/'}, this.showRoutes)
    }
}
export const mainRouter = new MainRouter()