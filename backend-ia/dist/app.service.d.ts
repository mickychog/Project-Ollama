import { DatabaseService } from './database.service';
export declare class AppService {
    private readonly databaseService;
    private readonly ollamaBase;
    constructor(databaseService: DatabaseService);
    generateStream(model: string, prompt: string, options?: Record<string, any>): Promise<any>;
    generate(model: string, prompt: string, options?: Record<string, any>): Promise<any>;
    queryDatabase(question: string, model: string, options?: Record<string, any>): Promise<{
        response: any;
        sql: any;
        results: any;
        rowCount: number;
    }>;
}
