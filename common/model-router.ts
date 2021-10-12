import { Router } from './router'
import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'

export abstract class ModelRouter<Document extends mongoose.Document> extends Router {
    basePath: string
    
    constructor(protected model: mongoose.Model<Document>) {
        super()
        this.basePath = `/${model.collection.name}`
    }

    protected prepareOne(query: mongoose.DocumentQuery<Document, Document>): mongoose.DocumentQuery<Document, Document> {
        return query
    }

    envelope(document: any):any {
        let resource = Object.assign({_links: {}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    validateId = (req, _res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else next()
    }

    findAll = (_req, res, next) => {
        this.model.find().then(this.renderAll(res,next))
        .catch(next)
    }

    findById = (req, res, next) => {
        this.prepareOne(this.model.findById(req.params.id))
        .then(this.render(res,next))
        .catch(next)
    }

    save = (req, res, next) => {
        let document = new this.model(req.body)
        //document.password = undefined
        document.save()
        .then(this.render(res,next))
        .catch(next)
    }

    replace = (req, res, next) => {
        const options = {runValidators: true, overwrite: true}
        this.model.update({_id: req.params.id}, req.body, options)
        .exec().then(result => {
            if (result.n) {
                return this.model.findById(req.params.id).exec()
            } 
            throw new NotFoundError('Documento não encontrado')
        })
        .then(this.render(res,next))
        .catch(next)
    }

    update = (req, res, next) => {
        const options = {runValidators: true, new: true}
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(res,next)).catch(next)
    }

    delete = (req, res, next) => {
        this.model.findByIdAndRemove(req.params.id, req.body)
        .then(user => {
            if(user) {
                res.json(user)
                return next()
            }
            throw new NotFoundError('Documento não encontrado')
        })
        .catch(next)
        // User.remove({_id: req.params.id}).exec().then((cmdResult: any) => {
        //     if(cmdResult.result.n) {
        //         res.send(204)
        //     }
        //     else {
        //         res.send(404)
        //     }
        //     return next()
        // })
    }
}