import { Response } from 'express';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';
export declare class AppController {
    private readonly appService;
    private readonly databaseService;
    constructor(appService: AppService, databaseService: DatabaseService);
    generate(body: {
        model: string;
        prompt: string;
        options?: any;
    }): Promise<any>;
    generateStream(body: {
        model: string;
        prompt: string;
        options?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    queryDatabase(body: {
        question: string;
        model: string;
        options?: any;
    }): Promise<{
        response: any;
        sql: any;
        results: any;
        rowCount: number;
    }>;
    getDatabaseInfo(): Promise<{
        success: boolean;
        tables: string[];
        context: string;
        message: string;
    } | {
        success: boolean;
        message: any;
        tables?: undefined;
        context?: undefined;
    }>;
}
