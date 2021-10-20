import * as jestCli from 'jest-cli'
import { enviroment } from "../common/environment"
import {Server} from '../server/server'
import {usersRouter} from '../users/users.router'
import {User} from '../users/users.model'
import {reviewsRouter} from '../reviews/reviews.router'
import {Review} from '../reviews/reviews.model'
import {restaurantsRouter} from '../restaurants/restaurants.router'
import {Restaurant} from '../restaurants/restaurants.model'

let server: Server

const beforeAllTests = () => {
	enviroment.db.url = process.env.DB_URL || "mongodb://localhost/meat-api-test-db"
	enviroment.server.port = process.env.SERVER_PORT || 3001
	server = new Server()
	return server.bootstrap([
		usersRouter,
		reviewsRouter,
		restaurantsRouter
	])
		.then(() => User.remove({}).exec())
		.then(() => Review.remove({}).exec())
		.then(() => Restaurant.remove({}).exec())

}

const afterAllTests = () => {
	return server.shutdown()
}

beforeAllTests()
.then(()=> jestCli.run())
.then(()=> afterAllTests())
.catch(console.error)