// src/database.service.ts
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    private connection: mysql.Connection;
    private isConnected: boolean = false;

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
        } catch (error) {
            console.error('❌ Error conectando a MySQL:', error.message);
            this.isConnected = false;
            return false;
        }
    }

    async executeQuery(sql: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }

        try {
            const [rows] = await this.connection.execute(sql);
            return rows;
        } catch (error) {
            throw new Error(`Error ejecutando query: ${error.message}`);
        }
    }

    async getTableSchema(tableName: string): Promise<any> {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }

        try {
            const [columns] = await this.connection.execute(`DESCRIBE ${tableName}`);
            return columns;
        } catch (error) {
            throw new Error(`Error obteniendo schema: ${error.message}`);
        }
    }

    async getAllTables(): Promise<string[]> {
        if (!this.isConnected) {
            throw new Error('Base de datos no conectada');
        }

        try {
            const [tables] = await this.connection.execute('SHOW TABLES');
            //return tables.map((row: any) => Object.values(row)[0] as string);
            return (tables as any[]).map((row: any) => Object.values(row)[0] as string);
        } catch (error) {
            throw new Error(`Error obteniendo tablas: ${error.message}`);
        }
    }

    async getDatabaseContext(): Promise<string> {
        const tables = await this.getAllTables();
        let context = 'Base de datos disponible con las siguientes tablas:\n\n';

        for (const table of tables) {
            const schema = await this.getTableSchema(table);
            context += `Tabla: ${table}\nColumnas:\n`;
            schema.forEach((col: any) => {
                context += `  - ${col.Field} (${col.Type})${col.Key === 'PRI' ? ' [PRIMARY KEY]' : ''}\n`;
            });
            context += '\n';
        }

        return context;
    }

    isConnectedToDatabase(): boolean {
        return this.isConnected;
    }
}