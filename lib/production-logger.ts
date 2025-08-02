/**
 * Production Logging System
 * Comprehensive logging for monitoring and debugging in production
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  stack?: string;
}

class ProductionLogger {
  private context: string;
  private requestId?: string;

  constructor(context: string = 'App', requestId?: string) {
    this.context = context;
    this.requestId = requestId;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      requestId: this.requestId,
      ...(data && { data }),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info';
    
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    return levels[level] <= levels[logLevel as keyof typeof levels];
  }

  private output(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    // In production, you might want to send to external logging service
    // like DataDog, New Relic, or CloudWatch
    
    if (process.env.NODE_ENV === 'production') {
      // Structured JSON logging for production
      console.log(JSON.stringify(entry));
    } else {
      // Human-readable logging for development
      const { timestamp, level, context, message, data } = entry;
      const colorMap = {
        error: '\x1b[31m',   // Red
        warn: '\x1b[33m',    // Yellow
        info: '\x1b[36m',    // Cyan
        debug: '\x1b[37m',   // White
      };
      
      const reset = '\x1b[0m';
      const color = colorMap[level];
      
      let logMessage = `${color}[${timestamp}] ${level.toUpperCase()} [${context}]${reset} ${message}`;
      
      if (data) {
        logMessage += `\n${JSON.stringify(data, null, 2)}`;
      }
      
      console.log(logMessage);
    }
  }

  error(message: string, error?: Error | any, data?: any) {
    const entry = this.formatMessage(LogLevel.ERROR, message, {
      ...data,
      ...(error && {
        error: {
          message: error.message || String(error),
          stack: error.stack,
          name: error.name,
        }
      })
    });

    this.output(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.formatMessage(LogLevel.WARN, message, data);
    this.output(entry);
  }

  info(message: string, data?: any) {
    const entry = this.formatMessage(LogLevel.INFO, message, data);
    this.output(entry);
  }

  debug(message: string, data?: any) {
    const entry = this.formatMessage(LogLevel.DEBUG, message, data);
    this.output(entry);
  }

  // API-specific logging methods
  apiRequest(method: string, path: string, userId?: string, data?: any) {
    this.info(`${method} ${path}`, {
      type: 'API_REQUEST',
      method,
      path,
      userId,
      data: process.env.LOG_LEVEL === 'debug' ? data : undefined,
    });
  }

  apiResponse(method: string, path: string, statusCode: number, responseTime?: number) {
    this.info(`${method} ${path} - ${statusCode}`, {
      type: 'API_RESPONSE',
      method,
      path,
      statusCode,
      responseTime,
    });
  }

  apiError(method: string, path: string, error: Error, statusCode?: number) {
    this.error(`${method} ${path} - API Error`, error, {
      type: 'API_ERROR',
      method,
      path,
      statusCode,
    });
  }

  databaseQuery(query: string, duration?: number, error?: Error) {
    if (error) {
      this.error('Database query failed', error, {
        type: 'DATABASE_ERROR',
        query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
        duration,
      });
    } else {
      this.debug('Database query executed', {
        type: 'DATABASE_QUERY',
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        duration,
      });
    }
  }

  security(event: string, details?: any) {
    this.warn(`Security event: ${event}`, {
      type: 'SECURITY_EVENT',
      event,
      ...details,
    });
  }

  performance(metric: string, value: number, threshold?: number) {
    const level = threshold && value > threshold ? LogLevel.WARN : LogLevel.INFO;
    
    this[level](`Performance metric: ${metric}`, {
      type: 'PERFORMANCE_METRIC',
      metric,
      value,
      threshold,
      isSlowQuery: threshold ? value > threshold : false,
    });
  }

  userActivity(userId: string, action: string, resource?: string, data?: any) {
    this.info(`User activity: ${action}`, {
      type: 'USER_ACTIVITY',
      userId,
      action,
      resource,
      data: process.env.LOG_LEVEL === 'debug' ? data : undefined,
    });
  }

  systemHealth(component: string, status: 'healthy' | 'unhealthy', details?: any) {
    const level = status === 'healthy' ? LogLevel.INFO : LogLevel.ERROR;
    
    this[level](`System health: ${component} is ${status}`, {
      type: 'SYSTEM_HEALTH',
      component,
      status,
      ...details,
    });
  }
}

// Create logger instances
export const createLogger = (context: string, requestId?: string) => 
  new ProductionLogger(context, requestId);

// Default logger instances
export const logger = createLogger('App');
export const apiLogger = createLogger('API');
export const dbLogger = createLogger('Database');
export const authLogger = createLogger('Auth');

// Request middleware to add logging context
export function createRequestLogger(request: Request) {
  const requestId = crypto.randomUUID();
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  const logger = createLogger('API', requestId);
  
  // Add request context
  (logger as any).requestContext = {
    requestId,
    ip,
    userAgent,
    url: request.url,
    method: request.method,
  };
  
  return logger;
}

// Error tracking for unhandled errors
if (typeof window === 'undefined') {
  // Server-side error handling
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', reason instanceof Error ? reason : new Error(String(reason)), {
      promise: promise.toString(),
    });
  });
}

// Graceful shutdown handling
export function setupGracefulShutdown() {
  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Add cleanup logic here
    setTimeout(() => {
      logger.info('Graceful shutdown completed');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default ProductionLogger;