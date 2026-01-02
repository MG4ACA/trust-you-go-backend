require('dotenv').config();
const mysql = require('mysql2/promise');

const createDatabase = async () => {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✓ Connected to MySQL server');

    // Create database
    const dbName = process.env.DB_NAME || 'trust_you_go';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log(`✓ Database "${dbName}" created successfully`);

    await connection.end();
    console.log('✓ Connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating database:', error.message);
    process.exit(1);
  }
};

createDatabase();
