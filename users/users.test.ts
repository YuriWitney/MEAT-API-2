import 'jest'
import * as request from 'supertest'

let address: string = global.address

describe('Get and Post tests', () => {
	it('test: get all users from /users', ()=>{
		return request(address)
			.get('/users')
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.items).toBeInstanceOf(Array)
			}).catch(fail)
	})
	
	it('test: post a users in /users', ()=>{
		return request(address)
			.post('/users')
			.send({
				name: "Test Jest Post",
				email: "testpost@jest.com",
				password: "jest123",
				cpf: "962.116.531-82"
			})
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body._id).toBeDefined()
				expect(response.body.name).toBe("Test Jest Post")
				expect(response.body.email).toBe("testpost@jest.com")
				expect(response.body.password).toBeUndefined()
				expect(response.body.cpf).toBe("962.116.531-82")
			}).catch(fail)
	})
})

describe('Get an invalid and Patch tests', () => {
	it('test: get an invalid user from /users', () => {
		return request(address)
			.get('/users/aaaa')
			.then(response => {
				expect(response.status).toBe(404)
			}).catch(fail)
	})

	it('test: patch from /users/:id', ()=> {
		return request(address)
			.post('/users')
			.send({
				name: "Test Jest Patch",
				email: "testpatch@jest.com",
				password: "jest123"
			})
			.then(response => 
				request(address)
					.patch(`/users/${response.body._id}`)
					.send({
						name: 'Test Jest Patch - Patch Success'
					})
					.then(response=> {
						expect(response.status).toBe(200)
						expect(response.body._id).toBeDefined()
						expect(response.body.name).toBe("Test Jest Patch - Patch Success")
						expect(response.body.email).toBe("testpatch@jest.com")
						expect(response.body.password).toBeUndefined()
					})
			).catch(fail)
	})
})
