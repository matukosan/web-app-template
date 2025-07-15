import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: 'smtp.resend.com',
	port: 465,
	auth: {
		user: 'resend',
		pass: env.RESEND_API_KEY
	},
	secure: true,
	tls: {
		rejectUnauthorized: false
	},
	// Timeout configurations to prevent hanging connections
	connectionTimeout: 10000, // 10 seconds to establish connection
	greetingTimeout: 5000,    // 5 seconds for SMTP greeting
	socketTimeout: 10000,     // 10 seconds for socket inactivity
	// Connection pooling for better performance
	pool: true,               // Use connection pooling
	maxConnections: 5,        // Max 5 concurrent connections
	maxMessages: 10           // Max 10 messages per connection
});

/**
 * Sends an email with retry logic
 */
async function sendEmailWithRetry(mailOptions: any, maxRetries = 3) {
	let lastError;
	
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const result = await transporter.sendMail(mailOptions);
			return result;
		} catch (error) {
			lastError = error;
			console.error(`Email send attempt ${attempt} failed:`, error);
			
			if (attempt < maxRetries) {
				// Exponential backoff: 1s, 2s, 4s
				const delay = Math.pow(2, attempt - 1) * 1000;
				console.log(`Retrying in ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}
	
	throw lastError;
}

/**
 * Sends a password reset email with a reset token.
 */
export async function sendOneTimePasswordEmail(to: string, token: string) {
	const baseUrl = env.SIGNIN_URL_BASE || 'http://localhost:5173';
	const url = `${baseUrl}/signin?token=${token}`;
	const senderEmail = env.EMAIL_SENDER || 'no-reply@example.com';
	const senderName = env.EMAIL_SENDER_NAME || 'App Template';

	console.log('Sending OTP email to:', to);
	console.log('Sender:', `${senderName} <${senderEmail}>`);

	const mailOptions = {
		from: `"${senderName}" <${senderEmail}>`,
		to,
		subject: 'One-Time Password',
		html: `
			<p>Hi there,</p>
			<p>You requested a one-time password. Click the link below to reset your password:</p>
			<p><a href="${url}">${url}</a></p>
			<p>Or enter the following one-time password:</p>
			<p><strong>${token}</strong></p>
		`
	};

	try {
		await sendEmailWithRetry(mailOptions);
		console.log('Email sent successfully to:', to);
	} catch (error) {
		console.error('Failed to send one-time password email after retries:', error);
		throw new Error('Failed to send one-time password email');
	}
}
