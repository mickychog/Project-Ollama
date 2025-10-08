"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mysql = require("mysql2/promise");
let DatabaseService = class DatabaseService {
    connection;
    isConnected = false;
    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'ECommerceDB',
                port: 3306,
            });
            this.isConnected = true;
            console.log('✅ Conectado a MySQL');
            return true;
        }
        catch (error) {
            console.error('❌ Error conectando a MySQL:', error.message);
            this.isConnected = false;
            return false;
        }
    }
    async executeQuery(sql) {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }
        try {
            const [rows] = await this.connection.execute(sql);
            return rows;
        }
        catch (error) {
            throw new Error(`Error ejecutando query: ${error.message}`);
        }
    }
    async getTableSchema(tableName) {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }
        try {
            const [columns] = await this.connection.execute(`DESCRIBE ${tableName}`);
            return columns;
        }
        catch (error) {
            throw new Error(`Error obteniendo schema: ${error.message}`);
        }
    }
    async getAllTables() {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }
        try {
            const [tables] = await this.connection.execute('SHOW TABLES');
            return tables.map((row) => Object.values(row)[0]);
        }
        catch (error) {
            throw new Error(`Error obteniendo tablas: ${error.message}`);
        }
    }
    async getDatabaseContext() {
        const tables = await this.getAllTables();
        let context = 'Base de datos disponible con las siguientes tablas:\n\n';
        for (const table of tables) {
            const schema = await this.getTableSchema(table);
            context += `Tabla: ${table}\nColumnas:\n`;
            schema.forEach((col) => {
                context += `  - ${col.Field} (${col.Type})${col.Key === 'PRI' ? ' [PRIMARY KEY]' : ''}\n`;
            });
            context += '\n';
        }
        return context;
    }
    isConnectedToDatabase() {
        return this.isConnected;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map