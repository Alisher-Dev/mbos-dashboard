"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const env_config_1 = require("./config/env.config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('mbos-dashboard')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(env_config_1.envConfig.port || 3000);
    console.log(`🚀🚀🚀 Listening on port ${env_config_1.envConfig.port} 🚀🚀🚀`);
}
bootstrap();
//# sourceMappingURL=main.js.map