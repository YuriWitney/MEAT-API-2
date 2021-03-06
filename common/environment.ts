export const enviroment = {
    server: { 
        port: process.env.PORT || 3000,
        url: process.env.URL ||'http://localhost:3000/'
    },
    db: {url: process.env.DB_URL || 'mongodb://localhost/meat-api-2'},
    security: { 
			saltRounds: process.env.SALT_ROUNDS || 10,
			apiSecret: process.env.API_SECRET || 'meat-api-secret',
		  enableHTTPS: process.env.ENABLE_HTTPS || false,
		  certificate: process.env.CERT_FILE || './security/keys/cert.pem',
			key: process.env.CERT_KEY_FILE || './security/keys/key.pem'},
		log: {
			level: process.env.LOG_LEVEL || 'debug',
			name: 'meat-api-logger' 
		}

}