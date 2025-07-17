This document should describe what the project is about and its functionality.

## Email Service

The application uses Postmark for sending transactional emails. The email service is configured in `src/lib/email/send.ts` and currently supports:

- One-time password (OTP) emails for authentication
- Retry logic with exponential backoff for reliability
- Both HTML and plain text email formats

### Configuration

The email service requires the following environment variables:

- `POSTMARK_API_TOKEN`: Your Postmark API token
- `EMAIL_SENDER`: The sender email address (must be verified in Postmark)
- `EMAIL_SENDER_NAME`: The sender display name
- `SIGNIN_URL_BASE`: Base URL for signin links in emails

### Usage

The email service is primarily used in the authentication flow when users request a one-time password to sign in.