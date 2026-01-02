require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const migrate = async () => {
  let connection;
  
  try {
    // Connect to MySQL database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trust_you_go',
      multipleStatements: true
    });

    console.log('✓ Connected to database');

    // Read migration file
    const migrationFile = path.join(__dirname, '../src/migrations/001_create_tables.sql');
    const sql = await fs.readFile(migrationFile, 'utf8');

    console.log('✓ Migration file loaded');
    console.log('→ Running migrations...\n');

    // Execute migration
    await connection.query(sql);

    console.log('\n✓ All tables created successfully');
    console.log('\nCreated tables:');
    console.log('  1. admins');
    console.log('  2. travelers');
    console.log('  3. agents');
    console.log('  4. locations');
    console.log('  5. location_images');
    console.log('  6. packages');
    console.log('  7. package_locations');
    console.log('  8. bookings');
    console.log('  9. package_requests');

    await connection.end();
    console.log('\n✓ Migration completed');
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

migrate();
