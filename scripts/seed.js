require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const seed = async () => {
  let connection;

  try {
    // Connect to MySQL database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trust_you_go',
      multipleStatements: true,
    });

    console.log('✓ Connected to database');

    // Generate password hash for default admin
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@2026';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    console.log('✓ Password hash generated');

    // Read seed file
    const seedFile = path.join(__dirname, '../src/migrations/002_seed_data.sql');
    let sql = await fs.readFile(seedFile, 'utf8');

    // Replace placeholder with actual password hash
    sql = sql.replace('$2a$10$YourBcryptHashWillBeGeneratedHere', passwordHash);

    console.log('✓ Seed file loaded');
    console.log('→ Seeding database...\n');

    // Execute seed data
    await connection.query(sql);

    console.log('\n✓ Database seeded successfully');
    console.log('\nSeeded data:');
    console.log('  • Default admin user');
    console.log('  • 10 tourist spots');
    console.log('  • 5 accommodations');
    console.log('  • 3 restaurants');
    console.log('  • 3 activities');
    console.log('  • 4 template packages');
    console.log('  • 2 sample agents');

    console.log('\n📧 Default Admin Credentials:');
    console.log(`   Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@trustyou-go.com'}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('\n⚠️  Please change the password after first login!\n');

    await connection.end();
    console.log('✓ Seeding completed');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
};

seed();
