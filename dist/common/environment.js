"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviroment = void 0;
exports.enviroment = {
    server: { port: 3000 || process.env.PORT },
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api-2' },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
};
