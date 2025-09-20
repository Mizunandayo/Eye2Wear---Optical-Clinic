/* eslint-disable no-undef */
/* Production Email Diagnostic Tool */
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmailConfigurations = async () => {
  console.log('🔍 Testing Email Configurations for Production...');
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Email User: ${process.env.EMAIL_USER}`);
  
  const configs = [
    {
      name: 'Gmail SMTP with TLS (Port 465)',
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
      }
    },
    {
      name: 'Gmail SMTP with STARTTLS (Port 587)',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        tls: {
          rejectUnauthorized: false
        }
      }
    },
    {
      name: 'Gmail Service (Nodemailer Built-in)',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`\n📧 Testing: ${name}`);
      const transporter = nodemailer.createTransport(config);
      
      console.log('  ⏳ Verifying connection...');
      await transporter.verify();
      console.log('  ✅ Connection successful!');
      
      transporter.close();
    } catch (error) {
      console.log('  ❌ Connection failed:', error.message);
      console.log('  📋 Error code:', error.code);
    }
  }
  
  console.log('\n🏁 Email configuration test completed!');
  console.log('\nNext steps:');
  console.log('1. If Port 587 works, add EMAIL_PORT=587 to production env');
  console.log('2. If Gmail Service works, remove custom host/port settings');
  console.log('3. If all fail, check Render network restrictions');
};

testEmailConfigurations().catch(console.error);