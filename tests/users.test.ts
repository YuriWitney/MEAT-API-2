import 'jest'
import * as request from 'supertest'
import * as faker from 'faker'
import * as testUserFixture from './fixtures/users/users.general.json'
import * as testUserData from './fixtures/users/users.data.json'
import * as testPutData from './fixtures/users/users.put.json'

let address = global.address

describe('Get tests', () => {
	it('should get and return status 200', ()=>{
		return request(address)
			.get('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.items).toBeInstanceOf(Array)
			}).catch(fail)
	})
	
	it('should get a user from a query by email in version 2.0.0', ()=>{
		const email = faker.internet.email()
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: email,
				password: testUserFixture.testParams.defaultPassword,
				cpf: "052.617.030-18"
			})
			.then(response => request(address)
				.get('/users')
				.set('Authorization', testUserFixture.testParams.auth)
				.set("Accept-Version", "2.0.0")
				.query({email: email}))
			.then(response => {
				expect(response.status).toBe(200)
			  expect(response.body.items).toBeInstanceOf(Array)
				expect(response.body.items).toHaveLength(1)
				expect(response.body.items[0].email).toBe(email)
				expect(response.body.items[0].cpf).toBe("052.617.030-18")
			}).catch(fail)
	})

	it('should get a user from a query by email in version 1.0.0', ()=>{
		const email = faker.internet.email()
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: email,
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response => request(address)
				.get('/users')
				.set('Authorization', testUserFixture.testParams.auth)
				.unset("Accept-Version")
				.set("Accept-Version", "1.0.0")
				.query({email: email}))
			.then(response => {
				expect(response.status).toBe(200)
			  expect(response.body.items).toBeInstanceOf(Array)
				expect(response.body.items[0]._id).toBeDefined
				expect(response.body.items[1]._id).toBeDefined
			}).catch(fail)
	})

	it('should get only a single user', () => {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response => request(address)
				.get(`/users/${response.body._id}`)
				.set('Authorization', testUserFixture.testParams.auth)
				.unset("Accept-Version")
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.name).toBeDefined()
					expect(response.body.email).toBeDefined()
					expect(response.body.password).toBeUndefined()
				})
			)
	})

	it('should get no user and statusCode 404', () => {
		return request(address)
			.get(`/users/aaaaa`)
			.set('Authorization', testUserFixture.testParams.auth)
			.then(response => {
				expect(response.statusCode).toBe(404)
			})
	})

})

describe('Post tests', () => {
	it('should post a users', ()=>{
		const userData = [
			faker.name.firstName(0),
			faker.internet.email(),
			testUserFixture.testParams.defaultPassword,
			"Male"
		]
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: userData[0],
				email: userData[1],
				password: userData[2],
				gender: userData[3]})
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body._id).toBeDefined()
				expect(response.body.name).toBe(userData[0])
				expect(response.body.email).toBe(userData[1])
				expect(response.body.password).toBeUndefined()
				expect(response.body.gender).toBe(userData[3])
			}).catch(fail)
	})

	it('should not post a no name users', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a no email users', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a no password users', ()=>{
		const testParams = [
			faker.name.findName(),
			faker.internet.email()]
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: testParams[0],
				email: testParams[1]
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})
	
	it('should not post a user with name less than 3 characters', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: testUserFixture.testParams.shortName,
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a user with name more than 80 characters', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: testUserFixture.testParams.longName,
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a user with invalid email', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: testUserFixture.testParams.invalidEmail,
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a user with invalid gender', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword,
				gender: testUserFixture.testParams.invalidGender
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

	it('should not post a user with invalid CPF', ()=>{
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword,
				cpf: testUserFixture.testParams.invalidCpf
			})
			.then(response=> {
				expect(response.statusCode).toBe(400)
				expect(response.body.message).toBe("validation error while processing your request")
			}).catch(fail)
	})

})

describe('Patch tests', () => {
	it('should patch a user', ()=> {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: testUserFixture.testParams.Name,
				email: testUserFixture.testParams.Email,
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response => 
				request(address)
					.patch(`/users/${response.body._id}`)
					.set('Authorization', testUserFixture.testParams.auth)
					.send({
						name: 'Test Jest Patch - Patch Success'
					})
					.then(response=> {
						expect(response.status).toBe(200)
						expect(response.body._id).toBeDefined()
						expect(response.body.name).toBe("Test Jest Patch - Patch Success")
						expect(response.body.email).toBe(testUserFixture.testParams.Email)
						expect(response.body.password).toBeUndefined()
					})
			).catch(fail)
	})

	it('should not patch a user with short name', ()=> {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response => 
				request(address)
					.patch(`/users/${response.body._id}`)
					.set('Authorization', testUserFixture.testParams.auth)
					.send({
						name: testUserFixture.testParams.shortName
					})
					.then(response=> {
						expect(response.statusCode).toBe(400)
						expect(response.body.message).toBe("validation error while processing your request")
					})
			).catch(fail)
	})

	it('should not patch a user with invalid email', ()=> {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: testUserFixture.testParams.defaultPassword
			})
			.then(response => 
				request(address)
					.patch(`/users/${response.body._id}`)
					.set('Authorization', testUserFixture.testParams.auth)
					.send({
						email: testUserFixture.testParams.invalidEmail
					})
					.then(response=> {
						expect(response.statusCode).toBe(400)
						expect(response.body.message).toBe("validation error while processing your request")
					})
			).catch(fail)
	})
})

describe('Put tests', () => {
	it('should put a user', ()=> {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send(testUserData[0])
			.then(response => 
				request(address)
					.put(`/users/${response.body._id}`)
					.set('Authorization', testUserFixture.testParams.auth)
					.send(testPutData)
					.then(response=> {
						expect(response.status).toBe(200)
						expect(response.body._id).toBeDefined()
						expect(response.body.name).toBe(testPutData.name)
						expect(response.body.email).toBe(testPutData.email)
						expect(response.body.password).toBeUndefined()
						expect(response.body.gender).toBe(testPutData.gender)
					})
			).catch(fail)
	})

	it('should not put a user without name', ()=> {
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send(testUserData[1])
			.then(response => 
				request(address)
					.put(`/users/${response.body._id}`)
					.set('Authorization', testUserFixture.testParams.auth)
					.send({
						email: 'put@gmail.com',
						password: '123456',
						gender: 'Female'
					})
					.then(response=> {
						expect(response.statusCode).toBe(400)
						expect(response.body.message).toBe("validation error while processing your request")
					})
			).catch(fail)
	})

})

describe('Delete tests', () => {
	it('should delete a user', ()=> {
		const userData = [
			faker.name.firstName(0),
			faker.internet.email(),
			testUserFixture.testParams.defaultPassword,
			"Male"
		]
		return request(address)
			.post('/users')
			.set('Authorization', testUserFixture.testParams.auth)
			.send({
				name: userData[0],
				email: userData[1],
				password: userData[2],
				gender: userData[3]})
			.then(response=> request(address)
				.delete(`/users/${response.body._id}`)
				.set('Authorization', testUserFixture.testParams.auth)
				.then(response => {
					expect(response.status).toBe(200)
					expect(response.body._id).toBeDefined()
					expect(response.body.name).toBe(userData[0])
					expect(response.body.email).toBe(userData[1])
					expect(response.body.password).toBeUndefined()
					expect(response.body.gender).toBe(userData[3])
				})
			).catch(fail)
	})

})

describe('Authentication tests', () => {
	it('should authorize a authentication', ()=>{
		return request(address)
			.post('/users/authenticate')
			.send({
				email:"admin@jest.com",
       	password:"123456"
			})
			.then(response=> {
				expect(response.status).toBe(200)
				expect(response.body.accessToken).toBeDefined()
			}).catch(fail)
	})
	
	it('should not authorize a authentication with incorrect password', ()=>{
		return request(address)
			.post('/users/authenticate')
			.send({
				email:"admin@jest.com",
       	password:"123"
			})
			.then(response=> {
				expect(response.status).toBe(403)
				expect(response.body.message).toBe("invalid credentials")
			}).catch(fail)
	})
	
	it('should not get without authorization', ()=>{
		return request(address)
			.get('/users')
			.then(response=> {
				expect(response.status).toBe(403)
				expect(response.body.message).toBe("permission denied")
			}).catch(fail)
	})

	it('should not get with invalid payload token', ()=>{
		return request(address)
			.get('/users')
			.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlQGZha2UuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.fcuLkuvDXtdahcOkoqubiBKAS95lEX9opgNXn5JI9to')
			.then(response=> {
				expect(response.status).toBe(403)
				expect(response.body.message).toBe("permission denied")
			}).catch(fail)
	})

	it('should not get with invalid signature token', ()=>{
		return request(address)
			.get('/users')
			.set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBqZXN0LmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.YDaVM2_Kt39HmqiEqeTL9c0hf34JTool0JoYbT31Do0')
			.then(response=> {
				expect(response.status).toBe(403)
				expect(response.body.message).toBe("permission denied")
			}).catch(fail)
	})

})
