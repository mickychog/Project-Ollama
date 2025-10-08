"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const database_service_1 = require("./database.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: 'http://localhost:3000' });
    const databaseService = app.get(database_service_1.DatabaseService);
    await databaseService.connect();
    await app.listen(3001);
    console.log('✅ Proxy server running on http://localhost:3001');
    console.log('🗄️ Database service initialized');
}
bootstrap();
//# sourceMappingURL=main.js.map