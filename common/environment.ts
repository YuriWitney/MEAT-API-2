export const enviroment = {
    server: { 
        port: 3000 || process.env.PORT,
        url: process.env.URL ||'http://localhost:3000/'
    },
    db: {url: process.env.DB_URL || 'mongodb://localhost/meat-api-2'},
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }

}