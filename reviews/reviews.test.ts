import 'jest'
import * as request from 'supertest'

let address: string = global.address

describe('Get and Post tests', () => {
	it('test: get all reviews from /reviews', ()=>{
		return request(address)
			.get('/reviews')
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.items).toBeInstanceOf(Array)
			}).catch(fail)
	})
})