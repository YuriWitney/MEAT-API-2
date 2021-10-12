"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantsRouter = void 0;
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(restaurant => {
                if (!restaurant)
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                else {
                    res.json(restaurant.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id).then(restaurant => {
                if (!restaurant)
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                else {
                    restaurant.menu = req.body;
                    return restaurant.save();
                }
            }).then(restaurant => {
                res.json(restaurant.menu);
                return next();
            }).catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();