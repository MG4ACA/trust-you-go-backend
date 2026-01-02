require('dotenv').config();
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const resetDatabase = async () => {
  let connection;
  
  try {
    const dbName = process.env.DB_NAME || 'trust_you_go';
    
    // Confirm action
    console.log('\n⚠️  WARNING: This will drop and recreate the entire database!');
    console.log(`   Database: ${dbName}`);
    console.log('   All data will be lost!\n');
    
    const answer = await question('Are you sure you want to continue? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n✓ Operation cancelled');
      rl.close();
      process.exit(0);
    }

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('\n✓ Connected to MySQL server');

    // Drop database
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    console.log(`✓ Database "${dbName}" dropped`);

    // Create database
    await connection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✓ Database "${dbName}" created`);

    await connection.end();
    
    console.log('\n✓ Database reset completed');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run db:migrate');
    console.log('  2. Run: npm run db:seed\n');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Reset failed:', error.message);
    if (connection) {
      await connection.end();
    }
    rl.close();
    process.exit(1);
  }
};

resetDatabase();
