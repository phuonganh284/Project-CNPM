/**
 * Email Verification Test Script
 * 
 * This script tests the email verification functionality
 * Run: node test-email.js
 */

const { sendVerificationEmail } = require('./src/utils/emailService');
require('dotenv').config();

async function testEmail() {
    console.log('🧪 Testing Email Configuration...\n');
    
    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('❌ Error: EMAIL_USER and EMAIL_PASSWORD not configured in .env file');
        console.log('\nPlease add these to your .env file:');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASSWORD=your-app-password\n');
        process.exit(1);
    }
    
    console.log('✅ Environment variables found:');
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD.substring(0, 4)}****`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}\n`);
    
    // Test data
    const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
    const testName = 'Test User';
    const testToken = 'test-token-12345678901234567890';
    const testCode = '123456';
    
    console.log('📧 Sending test verification email...');
    console.log(`   To: ${testEmail}`);
    console.log(`   Token: ${testToken}`);
    console.log(`   Code: ${testCode}\n`);
    
    try {
        await sendVerificationEmail(testEmail, testName, testToken, testCode);
        console.log('✅ Success! Email sent successfully!');
        console.log('\n📬 Check your inbox for the verification email.');
        console.log('   If not in inbox, check spam folder.\n');
    } catch (error) {
        console.error('❌ Failed to send email:');
        console.error(`   Error: ${error.message}\n`);
        
        if (error.code === 'EAUTH') {
            console.log('💡 Authentication failed. Please check:');
            console.log('   1. EMAIL_USER is correct');
            console.log('   2. EMAIL_PASSWORD is an App Password (not regular password)');
            console.log('   3. 2FA is enabled on your Google account');
            console.log('   4. Generate new App Password at: https://myaccount.google.com/apppasswords\n');
        } else if (error.code === 'ECONNECTION') {
            console.log('💡 Connection failed. Please check:');
            console.log('   1. Internet connection is working');
            console.log('   2. Firewall is not blocking SMTP (port 587/465)\n');
        }
        
        process.exit(1);
    }
}

// Run test
testEmail();
