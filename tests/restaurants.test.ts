import 'jest'
import * as request from 'supertest'
import * as testUserFixture from './fixtures/users/users.general.json'

let address: string = global.address

describe('Get tests', () => {
	it('test: get all restaurants from /restaurants', ()=>{
		return request(address)
			.get('/restaurants')
			.set('Authorization', testUserFixture.testParams.auth)
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.items).toBeInstanceOf(Array)
			}).catch(fail)
	})
})

describe('Post tests', () => {
	it('should post a restaurant', ()=>{
		return request(address)
			.post('/restaurants')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: "Porco e cia",
		    menu: [{
					name: "Porco",
					price: 60
				}]
			})
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body._id).toBeDefined()
				expect(response.body.name).toBe("Porco e cia")
				expect(response.body.menu).toBeInstanceOf(Array)
				expect(response.body.menu[0]).toMatchObject({
					name: "Porco",
					price: 60
				})
			}).catch(fail)
	})
})