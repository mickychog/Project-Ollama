import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Paperclip, X } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div style={{
      position: 'relative',
      marginBottom: '16px',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1e1e1e',
      border: '1px solid #3e3e3e'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #3e3e3e'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#858585',
          fontFamily: 'monospace',
          textTransform: 'lowercase'
        }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            backgroundColor: copied ? '#4CAF50' : 'transparent',
            color: copied ? '#fff' : '#858585',
            border: '1px solid',
            borderColor: copied ? '#4CAF50' : '#3e3e3e',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = '#3e3e3e';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#858585';
            }
          }}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </button>
      </div>

      <pre style={{
        margin: 0,
        padding: '16px',
        overflow: 'auto',
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        color: '#d4d4d4',
        backgroundColor: '#1e1e1e'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ResponseDisplay = ({ response }) => {
  const parseResponse = (text) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index);
        if (textContent.trim()) {
          parts.push({
            type: 'text',
            content: textContent
          });
        }
      }

      parts.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const textContent = text.slice(lastIndex);
      if (textContent.trim()) {
        parts.push({
          type: 'text',
          content: textContent
        });
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const parts = parseResponse(response);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              language={part.language}
            />
          );
        } else {
          return (
            <pre key={index} style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0 0 16px 0',
              overflow: 'auto',
              fontSize: '15px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#2d3748'
            }}>
              {part.content}
            </pre>
          );
        }
      })}
    </div>
  );
};

const ChatMessage = ({ message, isUser }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <div style={{
        maxWidth: '85%',
        backgroundColor: isUser ? '#4CAF50' : '#f0f0f0',
        color: isUser ? 'white' : '#333',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {isUser ? (
          <div style={{
            fontSize: '15px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {message.databaseQuery && (
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
                marginBottom: '8px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🗄️ Consulta a base de datos
              </div>
            )}
            {message.attachedFile && (
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '8px',
                marginBottom: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Paperclip size={14} />
                <span>{message.attachedFile.name}</span>
              </div>
            )}
            {message.content}
          </div>
        ) : (
          <div>
            <ResponseDisplay response={message.content} />
            {message.sql && (
              <details style={{
                marginTop: '12px',
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '13px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#1976d2' }}>
                  📊 Ver SQL ejecutado
                </summary>
                <pre style={{
                  marginTop: '8px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  {message.sql}
                </pre>
                {message.results && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Resultados ({Array.isArray(message.results) ? message.results.length : 0} filas):</strong>
                    <pre style={{
                      marginTop: '4px',
                      padding: '10px',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '11px',
                      maxHeight: '200px'
                    }}>
                      {JSON.stringify(message.results, null, 2)}
                    </pre>
                  </div>
                )}
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('deepseek-coder:6.7b');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [databaseMode, setDatabaseMode] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [databaseInfo, setDatabaseInfo] = useState(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const commonModels = [
    { name: 'phi:2.7b', memory: '~1.6GB', description: '⭐ Ligero - Recomendado para 2GB RAM' },
    { name: 'tinyllama:1.1b', memory: '~700MB', description: '🚀 Ultra ligero - Básico pero rápido' },
    { name: 'qwen:1.8b', memory: '~1.1GB', description: '💡 Pequeño pero potente' },
    { name: 'deepseek-coder:1.3b', memory: '~800MB', description: '👨‍💻 Código - Ultra ligero' },
    { name: 'deepseek-coder:6.7b', memory: '~3.3GB', description: '❌ Requiere 4GB+ RAM' },
    { name: 'llama2:7b', memory: '~3.8GB', description: '❌ Requiere 4GB+ RAM' },
    { name: 'codellama:7b', memory: '~3.8GB', description: '❌ Requiere 4GB+ RAM' }
  ];

  const predefinedPrompts = [
    "Escribe un hola mundo en Python",
    "Crea una función en JavaScript que ordene un array",
    "Explica qué es recursión con un ejemplo",
    "Crea un componente React simple",
    "Escribe una consulta SQL básica"
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const result = await fetch('http://localhost:3001/api/get-database-info', {
        method: 'POST',
      });
      const data = await result.json();
      if (data.success) {
        setDatabaseConnected(true);
        setDatabaseInfo(data);
      }
    } catch (error) {
      console.log('Base de datos no conectada');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        setError('El archivo es demasiado grande. Máximo 500KB permitido.');
        return;
      }

      setAttachedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const limitedContent = content.length > 10000
          ? content.substring(0, 10000) + '\n\n[... contenido truncado ...]'
          : content;
        setFileContent(limitedContent);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = {
      role: 'user',
      content: prompt,
      attachedFile: attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null,
      databaseQuery: databaseMode
    };

    setChatHistory(prev => [...prev, userMessage]);

    const currentPrompt = prompt;
    const currentFileContent = fileContent;
    const currentAttachedFile = attachedFile;

    setPrompt('');
    setAttachedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsLoading(true);
    setError('');

    try {
      if (databaseMode) {
        const response = await fetch('http://localhost:3001/api/query-database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: currentPrompt,
            model: model,
            options: {
              temperature: temperature,
              num_predict: maxTokens,
              top_k: 40,
              top_p: 0.9,
              repeat_penalty: 1.1
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          sql: data.sql,
          results: data.results
        };

        setChatHistory(prev => [...prev, assistantMessage]);
      } else {
        let finalPrompt = currentPrompt;

        if (currentFileContent) {
          if (currentFileContent.length > 5000 && model.includes('6.7b')) {
            const shouldSwitch = window.confirm(
              '⚠️ El archivo es grande y el modelo actual puede tardar mucho.\n\n' +
              '¿Deseas cambiar temporalmente a un modelo más ligero (qwen:1.8b) para esta consulta?'
            );
            if (shouldSwitch) {
              setModel('qwen:1.8b');
            }
          }

          finalPrompt = `Contexto del archivo "${currentAttachedFile.name}":\n\n${currentFileContent}\n\n---\n\nConsulta del usuario: ${currentPrompt}`;
        }

        const assistantMessageIndex = chatHistory.length + 1;
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: '',
          streaming: true
        }]);

        const response = await fetch('http://localhost:3001/api/generate-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            prompt: finalPrompt,
            options: {
              temperature: temperature,
              num_predict: maxTokens,
              top_k: 40,
              top_p: 0.9,
              repeat_penalty: 1.1,
              num_ctx: 2048,
              num_gpu: 99,
              num_thread: 8
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

          for (const line of lines) {
            const data = line.replace(/^data: /, '');
            try {
              const parsed = JSON.parse(data);

              if (parsed.token) {
                accumulatedText += parsed.token;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[assistantMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedText,
                    streaming: true
                  };
                  return newHistory;
                });
              }

              if (parsed.done) {
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[assistantMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedText,
                    streaming: false
                  };
                  return newHistory;
                });
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(`Error: ${err.message}`);
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError('No se puede conectar al servidor backend. Asegúrate de que esté ejecutándose en localhost:3001');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setPrompt('');
    setChatHistory([]);
    setError('');
    setDatabaseMode(false);
    handleRemoveFile();
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 40px)',
        maxHeight: '900px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px 30px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h1 style={{
            color: '#333',
            margin: '0 0 10px 0',
            fontSize: '2.2em'
          }}>
            🤖 Interfaz Ollama USFX
          </h1>
          <p style={{
            color: '#666',
            margin: '0',
            fontSize: '1.1em'
          }}>
            Backend: localhost:3001 → Ollama: localhost:11434
          </p>
        </div>

        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '14px'
              }}>
                Modelo:
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: isLoading ? '#f9f9f9' : 'white'
                }}
              >
                {commonModels.map(m => (
                  <option key={m.name} value={m.name}>
                    {m.name} - {m.description}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  flex: 1,
                  padding: '8px 15px',
                  backgroundColor: showAdvanced ? '#4CAF50' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {showAdvanced ? '🔧 Ocultar' : '⚙️ Opciones'}
              </button>
              {databaseConnected && (
                <button
                  type="button"
                  onClick={() => setDatabaseMode(!databaseMode)}
                  style={{
                    flex: 1,
                    padding: '8px 15px',
                    backgroundColor: databaseMode ? '#FF9800' : '#9C27B0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {databaseMode ? '🗄️ BD Activa' : '🗄️ Activar BD'}
                </button>
              )}
              <button
                onClick={clearAll}
                disabled={isLoading}
                style={{
                  padding: '8px 15px',
                  backgroundColor: isLoading ? '#ccc' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>

          {showAdvanced && (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '13px'
                  }}>
                    Temperatura: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Creatividad (0 = conservador, 2 = creativo)
                  </small>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '13px'
                  }}>
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: '#666', fontSize: '11px' }}>
                    Longitud máxima de respuesta
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 30px',
            backgroundColor: '#fafafa'
          }}
        >
          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{
                color: '#f44336',
                margin: '0 0 8px 0',
                fontSize: '1em'
              }}>
                ❌ Error
              </h4>
              <p style={{
                color: '#d32f2f',
                margin: '0',
                fontSize: '14px'
              }}>
                {error}
              </p>
            </div>
          )}

          {chatHistory.length === 0 && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                👋 ¡Bienvenido!
              </h2>
              <p style={{ marginBottom: '10px' }}>
                Comienza una conversación escribiendo tu consulta abajo
              </p>

              {databaseConnected && (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  border: '1px solid #4CAF50',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px' }}>
                    ✅ Base de datos conectada
                  </div>
                  <div style={{ color: '#666', fontSize: '13px' }}>
                    Tablas disponibles: {databaseInfo?.tables?.join(', ') || 'Cargando...'}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                    💡 Activa el modo BD para hacer consultas en tiempo real
                  </div>
                </div>
              )}

              {!databaseConnected && (
                <div style={{
                  backgroundColor: '#fff3e0',
                  border: '1px solid #FF9800',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#e65100', marginBottom: '8px' }}>
                    ⚠️ Base de datos no conectada
                  </div>
                  <div style={{ color: '#666', fontSize: '13px' }}>
                    Configura las credenciales en el backend para habilitar consultas SQL
                  </div>
                </div>
              )}

              <div>
                <p style={{
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  fontSize: '0.9em'
                }}>
                  💡 Consultas de ejemplo:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  {predefinedPrompts.map((predPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(predPrompt)}
                      disabled={isLoading}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        border: '1px solid #bbdefb',
                        borderRadius: '20px',
                        fontSize: '12px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = '#bbdefb';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = '#e3f2fd';
                        }
                      }}
                    >
                      {predPrompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {chatHistory.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}

          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#666',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '-0.32s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#666',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '-0.16s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#666',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}></div>
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {databaseMode ? 'Consultando base de datos...' : attachedFile ? 'Procesando archivo...' : 'Generando respuesta...'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white'
        }}>
          {databaseMode && (
            <div style={{
              backgroundColor: '#fff3e0',
              border: '1px solid #FF9800',
              borderRadius: '8px',
              padding: '10px 15px',
              marginBottom: '10px',
              fontSize: '13px',
              color: '#e65100',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🗄️ Modo Base de Datos Activo - Las consultas se ejecutarán en tiempo real
            </div>
          )}

          {attachedFile && (
            <div style={{
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196F3',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={16} color="#1976d2" />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '13px' }}>
                    {attachedFile.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {(attachedFile.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#f44336',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={databaseMode ? "Pregunta sobre tu base de datos (ej: ¿Cuántos registros hay en la tabla usuarios?)" : "Escribe tu mensaje aquí..."}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              style={{
                width: '100%',
                minHeight: '60px',
                maxHeight: '150px',
                padding: '12px 90px 12px 15px',
                border: databaseMode ? '2px solid #FF9800' : '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: isLoading ? '#f9f9f9' : 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = databaseMode ? '#FF9800' : '#4CAF50'}
              onBlur={(e) => e.target.style.borderColor = databaseMode ? '#FF9800' : '#ddd'}
            />

            <div style={{
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              display: 'flex',
              gap: '8px'
            }}>
              {!databaseMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Paperclip size={20} color={isLoading ? '#ccc' : '#666'} />
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isLoading || !prompt.trim() ? '#ccc' : databaseMode ? '#FF9800' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {isLoading ? '⏳' : '🚀'}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,.txt,.js,.py,.java,.cpp,.c,.html,.css,.json,.xml,.csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </form>

          <div style={{
            fontSize: '11px',
            color: '#999',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {databaseMode
              ? '🗄️ Modo BD: Tus preguntas generarán y ejecutarán SQL automáticamente'
              : 'Presiona Enter para enviar, Shift + Enter para nueva línea'
            }
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}

export default App;