// src/app.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) { }

  @Post('generate')
  async generate(@Body() body: { model: string; prompt: string; options?: any }) {
    try {
      console.log('Received request:', body);

      const model = body.model || 'deepseek-coder:6.7b';
      const prompt = body.prompt || '';
      const options = body.options || {};

      if (!prompt.trim()) {
        throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.appService.generate(model, prompt, options);
      return result;
    } catch (error) {
      console.error('Error in generate endpoint:', error);

      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'Cannot connect to Ollama. Make sure it is running on localhost:11434',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.response?.status) {
        throw new HttpException(
          `Ollama API error: ${error.response.status}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-stream')
  async generateStream(
    @Body() body: { model: string; prompt: string; options?: any },
    @Res() res: Response,
  ) {
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

      stream.on('data', (chunk: Buffer) => {
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
          } catch (e) {
            // Ignorar líneas mal formateadas
          }
        }
      });

      stream.on('error', (error: Error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });

      stream.on('end', () => {
        res.end();
      });

    } catch (error) {
      console.error('Error in generate-stream endpoint:', error);
      res.status(500).json({ error: error.message || 'Error processing stream' });
    }
  }

  @Post('query-database')
  async queryDatabase(@Body() body: { question: string; model: string; options?: any }) {
    try {
      console.log('Database query request:', body);

      if (!this.databaseService.isConnectedToDatabase()) {
        throw new HttpException(
          'Base de datos no conectada',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const question = body.question || '';
      const model = body.model || 'deepseek-coder:6.7b';
      const options = body.options || {};

      if (!question.trim()) {
        throw new HttpException('Question is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.appService.queryDatabase(question, model, options);
      return result;
    } catch (error) {
      console.error('Error in query-database endpoint:', error);

      throw new HttpException(
        error.message || 'Error processing database query',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('get-database-info')
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
    } catch (error) {
      console.error('Error getting database info:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}