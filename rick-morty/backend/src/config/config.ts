// src/config/config.ts
import 'dotenv/config';

export const config = {
    port: process.env['PORT'] || 3000,

    db: {
        url:      process.env['DATABASE_URL']!,
        host:     process.env['DB_HOST']!,
        port:     Number(process.env['DB_PORT']) || 5432,
        name:     process.env['DB_NAME']!,
        user:     process.env['DB_USER']!,
        password: process.env['DB_PASSWORD']!,
    },

    jwt: {
        secret:'klñadsjfñklajsñklejfañioja6sd4f64ew94f48d4fs54',
        refreshToken: process.env['REFRESH_TOKEN']!,
    },
};
