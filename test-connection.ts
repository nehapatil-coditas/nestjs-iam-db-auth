import { DataSource } from 'typeorm';
import { Signer } from '@aws-sdk/rds-signer';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

async function testDatabaseConnection() {
  const host = process.env.DB_HOST || '';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const username = process.env.DB_USERNAME || '';
  const database = process.env.DB_DATABASE || '';
  const region = process.env.AWS_REGION || 'ap-south-1';

  try {
    // Generate the IAM authentication token
    const signer = new Signer({ region, hostname: host, port, username });
    const token = await signer.getAuthToken();

    // Load the SSL certificate
    const sslCA = fs.readFileSync('./global-bundle.pem');

    // Create the data source (TypeORM connection)
    const dataSource = new DataSource({
      type: 'postgres',
      host,
      port,
      username,
      password: token,
      database,
      extra: {
        ssl: {
          rejectUnauthorized: true,
          ca: sslCA,
        },
      },
    });

    console.log(`Token:${token}`);
    // Initialize the connection
    await dataSource.initialize();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testDatabaseConnection();
