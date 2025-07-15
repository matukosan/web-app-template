# App Template

A full-stack SvelteKit application template with authentication, database integration, email services, and mobile app support via Capacitor.

## Features

- 🔐 **Authentication**: JWT-based authentication with refresh tokens
- 🗄️ **Database**: PostgreSQL with Drizzle ORM
- 📧 **Email**: Email services with Resend and Nodemailer
- 📱 **Mobile**: Native Android app support via Capacitor
- 🚀 **Deployment**: Automated deployment to Scaleway serverless containers
- 🎨 **UI**: Tailwind CSS with component library
- 🔒 **Security**: CSRF protection, secure cookies, input validation

## Prerequisites

### For Web Development
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database

### For Android Development
- All web development prerequisites
- Android Studio
- JDK 17+
- Android SDK (API level 34+)

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd app-template
npm install
```

### 2. Environment Setup
Copy the environment file and configure your variables:
```bash
cp .env.example .env
```

Configure these required variables:
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_DATABASE=app_template

# JWT Secrets
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_SENDER=noreply@yourdomain.com
EMAIL_SENDER_NAME=App Template

# App Settings
SIGNIN_URL_BASE=http://localhost:5173
ENABLE_SIGNUP=true
```

### 3. Database Setup
```bash
# Run migrations
npm run drizzle:migrate

# Optional: Seed database
npm run drizzle:seed
```

### 4. Development
```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

## Building for Production

### Web Application
```bash
# Build for web deployment
npm run build

# Preview production build
npm run preview
```

### Android Application

#### Prerequisites
1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Install JDK 17+** (recommended: OpenJDK)
3. **Set up Android SDK** via Android Studio
4. **Configure environment variables**:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Build Steps
```bash
# 1. Install Android dependencies (first time only)
npm install

# 2. Add Android platform (first time only)
npx cap add android

# 3. Build and sync to Android
npm run build:android

# 4. Open in Android Studio
npm run android

# Or build and open in one command
npm run android:build
```

#### Building APK/AAB
1. Open the project in Android Studio via `npm run android`
2. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Or for Play Store: **Build Bundle(s) / APK(s)** → **Build App Bundle(s)**

## Scripts Reference

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for web production
- `npm run preview` - Preview production build

### Database
- `npm run drizzle:generate` - Generate migration files
- `npm run drizzle:migrate` - Run migrations
- `npm run drizzle:studio` - Open Drizzle Studio
- `npm run drizzle:seed` - Seed database

### Mobile (Android)
- `npm run build:android` - Build static files and sync to Android
- `npm run android` - Open Android Studio
- `npm run android:build` - Build and open Android Studio

### Quality Assurance
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run Playwright integration tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run check` - Type check

## Project Structure

```
src/
├── lib/
│   ├── auth/           # Authentication utilities
│   ├── email/          # Email services
│   ├── mobile/         # Mobile/Capacitor utilities
│   ├── server/
│   │   ├── db/         # Database schema and migrations
│   │   └── services/   # Server-side business logic
│   └── components/     # Reusable UI components
├── routes/             # SvelteKit routes
└── app.html           # App shell (mobile-optimized)

android/                # Generated Android project (after cap add android)
capacitor.config.ts     # Capacitor configuration
svelte.config.js        # SvelteKit config (web)
svelte.config.mobile.js # SvelteKit config (mobile)
```

## Mobile Development Notes

### Platform Detection
Use the provided utilities to detect the platform:
```typescript
import { isNativePlatform, isAndroid, isWeb } from '$lib/mobile/capacitor';

if (isNativePlatform()) {
  // Running in mobile app
} else {
  // Running in web browser
}
```

### Mobile-Specific Features
The app automatically:
- Uses static adapter for mobile builds
- Optimizes viewport for mobile screens
- Includes Capacitor platform detection
- Provides safe Capacitor plugin imports

### Debugging
- **Web**: Use browser dev tools
- **Android**: Use Chrome DevTools (chrome://inspect) or Android Studio logcat

## Deployment

The project includes automated deployment to Scaleway:
- Database setup and migrations via GitHub Actions
- Serverless container deployment
- Environment variable management

See `.github/workflows/` for deployment configurations.

## Environment Variables

### Required
- `DATABASE_*` - Database connection settings
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - Authentication secrets
- `RESEND_API_KEY` - Email service API key

### Optional
- `ENABLE_SIGNUP` - Enable/disable user registration
- `EMAIL_SENDER*` - Email configuration
- `SIGNIN_URL_BASE` - Base URL for email links

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Android Build Issues
- **Gradle sync failed**: Check JDK version (requires JDK 17+)
- **SDK not found**: Ensure `ANDROID_HOME` is set correctly
- **Build tools missing**: Install via Android Studio SDK Manager

### Database Issues
- **Connection failed**: Check PostgreSQL is running and credentials are correct
- **Migration errors**: Ensure database exists and user has proper permissions

### Email Issues
- **SMTP timeout**: Check network connectivity and Resend API key
- **Authentication failed**: Verify RESEND_API_KEY is valid

## License

[Your License Here]