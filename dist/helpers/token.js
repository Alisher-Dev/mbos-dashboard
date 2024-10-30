"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("../config/env.config");
const jsonwebtoken_1 = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
class Token {
    constructor() {
        this.accessSecret = env_config_1.envConfig.jwt.accessSecret;
        this.refreshSecret = env_config_1.envConfig.jwt.refreshSecret;
    }
    generateAccessToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, this.accessSecret, { expiresIn: '10m' });
    }
    generateRefreshToken(payload) {
        return (0, jsonwebtoken_1.sign)(payload, this.refreshSecret, { expiresIn: '7d' });
    }
    verifyAccessToken(accessToken) {
        try {
            return (0, jsonwebtoken_1.verify)(accessToken, this.accessSecret);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('authentic token');
        }
    }
    verifyRefreshToken(refreshToken) {
        try {
            return (0, jsonwebtoken_1.verify)(refreshToken, this.refreshSecret);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('authentic token');
        }
    }
}
exports.default = new Token();
//# sourceMappingURL=token.js.map