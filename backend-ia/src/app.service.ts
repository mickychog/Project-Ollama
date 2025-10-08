// src/app.service.ts 
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from './database.service';

@Injectable()
export class AppService {
  private readonly ollamaBase = 'http://localhost:11434';

  constructor(private readonly databaseService: DatabaseService) { }

  
  async generateStream(model: string, prompt: string, options: Record<string, any> = {}) {
    try {
      console.log(`Starting stream for model: ${model}`);

      const payload = {
        model,
        prompt,
        stream: true,
        ...options,
      };

      const response = await axios.post(`${this.ollamaBase}/api/generate`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 300000,
        responseType: 'stream',
      });

      return response.data;
    } catch (error) {
      console.error('Error in generateStream:', error.message);
      throw error;
    }
  }

  // ⬇️ MANTENER ESTE MÉTODO (ya lo tienes)
  async generate(model: string, prompt: string, options: Record<string, any> = {}) {
    try {
      console.log(`Connecting to Ollama at ${this.ollamaBase}`);
      console.log('Request payload:', { model, prompt: prompt.substring(0, 100) + '...', options });

      const payload = {
        model,
        prompt,
        stream: false,
        ...options,
      };

      const res = await axios.post(`${this.ollamaBase}/api/generate`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 300000,
      });

      console.log('Ollama response received successfully');
      return res.data;
    } catch (error) {
      console.error('Error in AppService.generate:', error.message);

      if (error.response?.data?.error) {
        const ollamaError = error.response.data.error;

        if (ollamaError.includes('system memory')) {
          throw new Error(`❌ Memoria insuficiente: ${ollamaError}. Usa un modelo más pequeño como phi:2.7b`);
        }

        if (ollamaError.includes('model') && ollamaError.includes('not found')) {
          throw new Error(`🔍 Modelo no encontrado: ${model}. Ejecuta: ollama pull ${model}`);
        }

        throw new Error(`Ollama error: ${ollamaError}`);
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to Ollama service');
      }

      throw error;
    }
  }

  // ⬇️ MANTENER ESTE MÉTODO (ya lo tienes)
  async queryDatabase(question: string, model: string, options: Record<string, any> = {}) {
    try {
      const dbContext = await this.databaseService.getDatabaseContext();

      const sqlPrompt = `Eres un experto en SQL de MySQL. Dada la siguiente estructura de base de datos y una pregunta, genera ÚNICAMENTE la consulta SQL necesaria.

IMPORTANTE: 
- Responde SOLO con la consulta SQL pura, sin explicaciones
- NO uses formato markdown (nada de \`\`\`sql)
- NO agregues comentarios
- Solo SELECT queries (no DELETE, UPDATE, DROP, etc)

${dbContext}

Pregunta: ${question}

SQL:`;

      console.log('Generando SQL...');
      const sqlResponse = await this.generate(model, sqlPrompt, {
        temperature: 0.1,
        num_predict: 256,
      });

      let generatedSQL = sqlResponse.response
        .trim()
        .replace(/```sql/g, '')
        .replace(/```/g, '')
        .replace(/;+$/g, '')
        .trim();

      if (!generatedSQL.toUpperCase().startsWith('SELECT')) {
        throw new Error('Por seguridad, solo se permiten consultas SELECT');
      }

      console.log('SQL generado:', generatedSQL);

      const results = await this.databaseService.executeQuery(generatedSQL);
      console.log(`Resultados obtenidos: ${Array.isArray(results) ? results.length : 0} filas`);

      const interpretPrompt = `Pregunta del usuario: ${question}

SQL ejecutado:
${generatedSQL}

Resultados (${Array.isArray(results) ? results.length : 0} filas):
${JSON.stringify(results, null, 2)}

Interpreta estos resultados de manera clara y concisa en español. Si hay datos numéricos, menciona los valores específicos.`;

      console.log('Interpretando resultados...');
      const interpretResponse = await this.generate(model, interpretPrompt, options);

      return {
        response: interpretResponse.response,
        sql: generatedSQL,
        results: results,
        rowCount: Array.isArray(results) ? results.length : 0,
      };
    } catch (error) {
      console.error('Error in queryDatabase:', error.message);
      throw error;
    }
  }
}