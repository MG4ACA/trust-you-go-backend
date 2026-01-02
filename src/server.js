require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { testConnection, closePool } = require('./config/database');

const PORT = config.server.port;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('✗ Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log(`🚀 Trust You Go API Server`);
      console.log('='.repeat(50));
      console.log(`Environment: ${config.server.env}`);
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`API Base: http://localhost:${PORT}${config.server.apiPrefix}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
      console.log('');
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n⏳ Shutting down gracefully...');
      
      server.close(async () => {
        console.log('✓ HTTP server closed');
        await closePool();
        console.log('✓ Server shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
