export declare class DatabaseService {
    private connection;
    private isConnected;
    connect(): Promise<boolean>;
    executeQuery(sql: string): Promise<any>;
    getTableSchema(tableName: string): Promise<any>;
    getAllTables(): Promise<string[]>;
    getDatabaseContext(): Promise<string>;
    isConnectedToDatabase(): boolean;
}
