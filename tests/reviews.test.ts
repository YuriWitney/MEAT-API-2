import 'jest'
import * as request from 'supertest'
import * as mongoose from 'mongoose'
import * as testUserFixture from './fixtures/users/users.general.json'

let address: string = global.address

describe('Get tests', () => {
	it('test: get all reviews from /reviews', ()=>{
		return request(address)
			.get('/reviews')
			.set('Authorization', testUserFixture.testParams.auth)
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.items).toBeInstanceOf(Array)
			}).catch(fail)
	})
})

describe('Post tests', () => {
	it('should post a review', ()=>{
		return request(address)
			.post('/reviews')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				date: "2021-10-09T18:08:10",
		    rating: 4,
		    comments: "Muito bom!!",
		    user: new mongoose.Types.ObjectId,
		    restaurant: new mongoose.Types.ObjectId
			})
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body._id).toBeDefined()
				expect(response.body.comments).toBe("Muito bom!!")
				expect(response.body.user).toBeDefined()
				expect(response.body.restaurant).toBeDefined()
				expect(response.body.date).toBe("2021-10-09T21:08:10.000Z") //+3h TODO
			}).catch(fail)
	})
})

