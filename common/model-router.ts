import { Router } from './router'
import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'
import { enviroment } from './environment'

export abstract class ModelRouter<Document extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number = 4
    
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
        resource._links.main = enviroment.server.url
        return resource
    }

    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        }
        if(options.page && options.pageSize && options.count){
            if(options.page > 1){
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
            }
            const remaining = options.count - (options.pageSize * options.page)
            if(remaining > 0){
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`
            } 
        }
        return resource
    }

    validateId = (req, _res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else next()
    }

    findAll = (req, res, next) => {
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1

        const skip = (page - 1) * this.pageSize

        this.model.count({}).exec()
        .then(count => this.model.find()
            .skip(skip)
            .limit(this.pageSize)
            .then(this.renderAll(res,next, {
                page, 
                count, 
                pageSize: this.pageSize,
                url: req.url}))
        )
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
            throw new NotFoundError('Documento n??o encontrado')
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
            throw new NotFoundError('Documento n??o encontrado')
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