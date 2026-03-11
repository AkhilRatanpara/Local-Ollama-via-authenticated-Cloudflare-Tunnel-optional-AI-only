import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { MailService } from '@/lib/mail-service';

async function test() {
    console.log('--- Email Service Test ---');
    console.log('Using Email:', process.env.EMAIL_USER);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Error: EMAIL_USER or EMAIL_PASS is missing in .env');
        return;
    }

    const testUser = {
        email: process.env.EMAIL_USER, // Send it to yourself
        name: 'Test Administrator'
    };

    const dummyScheme = {
        title: 'Test Scheme Notification',
        ministry: 'Ministry of Testing',
        description: 'This is a test notification to verify that the Sangam Portal email service is correctly configured and pointing to your Gmail account.',
        category: 'Information Technology'
    };

    console.log('Sending test email...');
    try {
        await MailService.notifyNewScheme([testUser], dummyScheme);
        console.log('SUCCESS! Please check your inbox (and Spam folder) for the test email.');
    } catch (error) {
        console.error('FAILED to send email. Common reasons:');
        console.error('1. Incorrect App Password (must be 16 characters)');
        console.error('2. 2FA not enabled on Google account');
        console.error('3. Firewall/Network blocking SMTP (less common)');
        console.error('\nFull error details:', error);
    }
}

test();
