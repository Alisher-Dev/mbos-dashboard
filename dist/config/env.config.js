"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.envConfig = {
    port: process.env.PORT,
    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
    },
    jwt: {
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    },
};
//# sourceMappingURL=env.config.js.map