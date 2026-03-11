import nodemailer from 'nodemailer';

export class MailService {
    private static getTransporter() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return null;
        }

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                // Remove spaces from app password if present
                pass: process.env.EMAIL_PASS.replace(/\s/g, ''), 
            },
        });
    }

    /**
     * Sends an email to multiple recipients
     */
    static async sendBulkEmail(to: string[], subject: string, html: string) {
        const transporter = this.getTransporter();
        
        if (!transporter) {
            console.warn('Mail Service: EMAIL_USER or EMAIL_PASS not set. Skipping email.');
            return;
        }

        try {
            const info = await transporter.sendMail({
                from: `"Sangam Portal" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER, // Send to self
                bcc: to, // All users in BCC for privacy
                subject,
                html,
            });
            console.log('Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Mail Service Error:', error);
            throw error;
        }
    }

    /**
     * Specifically sends notification for a new scheme
     */
    static async notifyNewScheme(users: { email: string; name: string | null }[], scheme: any) {
        if (users.length === 0) return;

        const emails = users.map(u => u.email);
        const subject = `New Scheme Launched: ${scheme.title}`;
        
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; color: #334155; line-height: 1.6;">
                <div style="background-color: #1e293b; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Sangam Portal</h1>
                    <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">Government Schemes & Rewards Opportunity</p>
                </div>
                
                <div style="padding: 40px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">New Scheme Alert: ${scheme.title}</h2>
                    <p>Hello,</p>
                    <p>A significant new government opportunity has been published that matches the Sangam portal standards. Please review the comprehensive details below:</p>
                    
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">${scheme.title}</h3>
                        
                        <p style="margin: 8px 0;"><strong>🏛️ Ministry:</strong> ${scheme.ministry}</p>
                        <p style="margin: 8px 0;"><strong>📂 Category:</strong> ${scheme.category}</p>
                        ${scheme.amount ? `<p style="margin: 8px 0;"><strong>💰 Benefit Amount:</strong> ₹${Number(scheme.amount).toLocaleString('en-IN')}</p>` : ''}
                        ${scheme.deadline ? `<p style="margin: 8px 0; color: #ef4444;"><strong>⏰ Deadline:</strong> ${new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
                        
                        <div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Description</h4>
                            <p style="margin: 0; font-size: 14px;">${scheme.description}</p>
                        </div>
                        
                        ${scheme.benefits ? `
                        <div style="margin-top: 15px;">
                            <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Key Benefits</h4>
                            <p style="margin: 0; font-size: 14px;">${scheme.benefits}</p>
                        </div>` : ''}
                        
                        ${scheme.eligibility ? `
                        <div style="margin-top: 15px;">
                            <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Eligibility Criteria</h4>
                            <p style="margin: 0; font-size: 14px;">${scheme.eligibility}</p>
                        </div>` : ''}
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/schemes" 
                           style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                           View on Sangam Portal
                        </a>
                        
                        ${scheme.applicationUrl ? `
                        <p style="margin-top: 20px;">
                            <a href="${scheme.applicationUrl}" style="color: #2563eb; font-weight: 600; text-decoration: underline;">
                                Apply via Official Government Portal →
                            </a>
                        </p>` : ''}
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                        You are receiving this automated notification because you are a registered user of Sangam Portal.<br/>
                        &copy; 2026 Sangam Portal. All rights reserved.
                    </p>
                </div>
            </div>
        `;

        return this.sendBulkEmail(emails, subject, html);
    }
}
