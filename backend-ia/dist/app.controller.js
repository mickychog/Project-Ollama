"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const database_service_1 = require("./database.service");
let AppController = class AppController {
    appService;
    databaseService;
    constructor(appService, databaseService) {
        this.appService = appService;
        this.databaseService = databaseService;
    }
    async generate(body) {
        try {
            console.log('Received request:', body);
            const model = body.model || 'deepseek-coder:6.7b';
            const prompt = body.prompt || '';
            const options = body.options || {};
            if (!prompt.trim()) {
                throw new common_1.HttpException('Prompt is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.appService.generate(model, prompt, options);
            return result;
        }
        catch (error) {
            console.error('Error in generate endpoint:', error);
            if (error.code === 'ECONNREFUSED') {
                throw new common_1.HttpException('Cannot connect to Ollama. Make sure it is running on localhost:11434', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            if (error.response?.status) {
                throw new common_1.HttpException(`Ollama API error: ${error.response.status}`, common_1.HttpStatus.BAD_GATEWAY);
            }
            throw new common_1.HttpException(error.message || 'Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateStream(body, res) {
        try {
            console.log('Received streaming request:', { model: body.model, promptLength: body.prompt?.length });
            const model = body.model || 'deepseek-coder:6.7b';
            const prompt = body.prompt || '';
            const options = body.options || {};
            if (!prompt.trim()) {
                return res.status(400).json({ error: 'Prompt is required' });
            }
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('X-Accel-Buffering', 'no');
            const stream = await this.appService.generateStream(model, prompt, options);
            stream.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(line => line.trim());
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.response) {
                            res.write(`data: ${JSON.stringify({ token: parsed.response })}\n\n`);
                        }
                        if (parsed.done) {
                            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                            res.end();
                        }
                    }
                    catch (e) {
                    }
                }
            });
            stream.on('error', (error) => {
                console.error('Stream error:', error);
                res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                res.end();
            });
            stream.on('end', () => {
                res.end();
            });
        }
        catch (error) {
            console.error('Error in generate-stream endpoint:', error);
            res.status(500).json({ error: error.message || 'Error processing stream' });
        }
    }
    async queryDatabase(body) {
        try {
            console.log('Database query request:', body);
            if (!this.databaseService.isConnectedToDatabase()) {
                throw new common_1.HttpException('Base de datos no conectada', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            const question = body.question || '';
            const model = body.model || 'deepseek-coder:6.7b';
            const options = body.options || {};
            if (!question.trim()) {
                throw new common_1.HttpException('Question is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.appService.queryDatabase(question, model, options);
            return result;
        }
        catch (error) {
            console.error('Error in query-database endpoint:', error);
            throw new common_1.HttpException(error.message || 'Error processing database query', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDatabaseInfo() {
        try {
            const isConnected = this.databaseService.isConnectedToDatabase();
            if (!isConnected) {
                return {
                    success: false,
                    message: 'Base de datos no conectada',
                };
            }
            const tables = await this.databaseService.getAllTables();
            const context = await this.databaseService.getDatabaseContext();
            return {
                success: true,
                tables,
                context,
                message: 'Conectado exitosamente',
            };
        }
        catch (error) {
            console.error('Error getting database info:', error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('generate-stream'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generateStream", null);
__decorate([
    (0, common_1.Post)('query-database'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "queryDatabase", null);
__decorate([
    (0, common_1.Post)('get-database-info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDatabaseInfo", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        database_service_1.DatabaseService])
], AppController);
//# sourceMappingURL=app.controller.js.map