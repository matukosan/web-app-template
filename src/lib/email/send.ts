import * as postmark from 'postmark';
import { env } from '$env/dynamic/private';

// Initialize Postmark client
const client = new postmark.ServerClient(env.POSTMARK_API_TOKEN || '');

/**
 * Sends an email with retry logic
 */
async function sendEmailWithRetry(mailOptions: postmark.Message, maxRetries = 3) {
	let lastError;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const result = await client.sendEmail(mailOptions);
			return result;
		} catch (error) {
			lastError = error;
			console.error(`Email send attempt ${attempt} failed:`, error);

			if (attempt < maxRetries) {
				// Exponential backoff: 1s, 2s, 4s
				const delay = Math.pow(2, attempt - 1) * 1000;
				console.log(`Retrying in ${delay}ms...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
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

	const mailOptions: postmark.Message = {
		From: `${senderName} <${senderEmail}>`,
		To: to,
		Subject: 'One-Time Password',
		HtmlBody: `
			<p>Hi there,</p>
			<p>You requested a one-time password. Click the link below to reset your password:</p>
			<p><a href="${url}">${url}</a></p>
			<p>Or enter the following one-time password:</p>
			<p><strong>${token}</strong></p>
		`,
		TextBody: `Hi there,

You requested a one-time password. Click the link below to reset your password:
${url}

Or enter the following one-time password:
${token}`,
		MessageStream: 'outbound'
	};

	try {
		await sendEmailWithRetry(mailOptions);
		console.log('Email sent successfully to:', to);
	} catch (error) {
		console.error('Failed to send one-time password email after retries:', error);
		throw new Error('Failed to send one-time password email');
	}
}
