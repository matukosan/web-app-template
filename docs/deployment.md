# Deployment Guide

This guide covers deploying both the web application and Android mobile app.

## Web Application Deployment

### Scaleway Serverless Containers (Automated)

The project includes automated deployment via GitHub Actions.

#### Setup
1. **Configure GitHub Environment**:
   - Go to repository → Settings → Environments
   - Create environment named `PROD`
   - Add required secrets (see Environment Variables section)

2. **Push to Main Branch**:
   ```bash
   git push origin main
   ```

3. **Monitor Deployment**:
   - Check GitHub Actions tab
   - Database setup runs first
   - Container deployment follows

#### Manual Deployment
```bash
# Build for production
npm run build

# Deploy using Scaleway CLI (if configured locally)
scw container container deploy <container-id>
```

### Alternative Deployments

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

#### Docker (Self-Hosted)
```bash
# Build image
docker build -t app-template .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  app-template
```

## Mobile App Deployment

### Google Play Store

#### Prerequisites
1. **Google Play Developer Account** ($25 one-time fee)
2. **Signed App Bundle** (generated from Android Studio)
3. **App Store Assets** (icons, screenshots, descriptions)

#### Build Process
1. **Generate Signed Bundle**:
   ```bash
   # Build optimized version
   npm run build:android
   
   # Open Android Studio
   npm run android
   ```

2. **In Android Studio**:
   - Build → Generate Signed Bundle / APK
   - Choose **Android App Bundle**
   - Create/select signing key
   - Build release AAB

3. **Upload to Play Console**:
   - Create new app listing
   - Upload AAB file
   - Complete store listing details
   - Submit for review

#### Store Listing Requirements
- **App Icon**: 512x512px PNG
- **Screenshots**: At least 2 per supported device type
- **Feature Graphic**: 1024x500px (optional but recommended)
- **App Description**: Clear, concise description
- **Privacy Policy**: Required for most apps
- **Content Rating**: IARC questionnaire

### Alternative Distribution

#### Direct APK Installation
```bash
# Generate debug APK for testing
npm run build:android
npm run android

# In Android Studio: Build → Build APK(s)
# APK location: android/app/build/outputs/apk/debug/
```

#### Firebase App Distribution
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Setup App Distribution
firebase login
firebase init appdistribution

# Upload APK
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app <firebase-app-id> \
  --groups "testers"
```

## Environment Variables

### Required Variables

#### Database
```env
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password
DATABASE_DATABASE=your-database-name
```

#### Authentication
```env
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret
```

#### Email Service
```env
RESEND_API_KEY=re_your-resend-api-key
EMAIL_SENDER=noreply@yourdomain.com
EMAIL_SENDER_NAME=Your App Name
```

#### App Configuration
```env
SIGNIN_URL_BASE=https://yourdomain.com
ENABLE_SIGNUP=true
NODE_ENV=production
```

#### Scaleway (for automated deployment)
```env
SCW_ACCESS_KEY=your-access-key
SCW_SECRET_KEY=your-secret-key
SCW_DEFAULT_ORGANIZATION_ID=your-org-id
SCW_DEFAULT_PROJECT_ID=your-project-id
SCW_DEFAULT_REGION=fr-par
REGISTRY_ENDPOINT=rg.fr-par.scw.cloud
CONTAINER_NAMESPACE=your-namespace
CONTAINER_NAME=your-app-name
```

### Security Best Practices
- Use strong, unique secrets for JWT tokens
- Rotate API keys regularly
- Use environment-specific secrets
- Never commit secrets to version control
- Use secret management services in production

## CI/CD Pipeline

### GitHub Actions Workflow

#### Database Setup (`database-setup.yml`)
1. **Triggers**: Push to main branch
2. **Actions**:
   - Set up PostgreSQL service
   - Check/create database
   - Run Drizzle migrations
   - Verify setup completion

#### Deployment (`deploy.yml`)
1. **Triggers**: After successful database setup
2. **Actions**:
   - Build Docker image
   - Push to Scaleway Container Registry
   - Deploy to serverless container
   - Update environment variables

#### Workflow Dependencies
```
Push to main → Database Setup → Container Deployment
```

### Manual Deployment Steps

#### 1. Database Setup
```bash
# Run migrations
npm run drizzle:migrate

# Verify database connection
npm run drizzle:studio
```

#### 2. Build Application
```bash
# Web build
npm run build

# Mobile build
npm run build:android
```

#### 3. Deploy
```bash
# Web deployment (varies by platform)
# Mobile: Upload to Play Store
```

## Monitoring and Maintenance

### Health Checks
- Database connectivity
- API endpoint availability
- Email service functionality
- Container resource usage

### Logging
```bash
# Scaleway container logs
scw container container logs <container-id>

# Local development logs
npm run dev  # Check console output
```

### Updates
1. **Web Application**:
   - Push to main branch triggers automatic deployment
   - Monitor GitHub Actions for deployment status

2. **Mobile Application**:
   - Build new version with updated version number
   - Upload to Play Store
   - Users receive update notification

### Rollback Procedures
1. **Web**: Redeploy previous container version
2. **Mobile**: Cannot rollback; must release new version

## Performance Optimization

### Web Application
- Enable container auto-scaling
- Implement CDN for static assets
- Use connection pooling for database
- Monitor response times and error rates

### Mobile Application
- Optimize app bundle size
- Implement offline functionality
- Use lazy loading for large features
- Monitor crash reports and performance

## Security Considerations

### Web Application
- HTTPS everywhere
- CORS configuration
- Input validation and sanitization
- Regular security updates

### Mobile Application
- Code obfuscation for release builds
- Certificate pinning for API calls
- Secure storage for sensitive data
- Regular dependency updates

## Troubleshooting

### Common Deployment Issues

#### Database Connection Failed
```bash
# Check database connectivity
psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_DATABASE

# Verify environment variables
echo $DATABASE_HOST
```

#### Container Build Failed
```bash
# Check Dockerfile syntax
docker build -t test .

# Verify dependencies
npm install --production
```

#### Mobile Build Failed
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Rebuild
npm run build:android
```

### Getting Help
- Check GitHub Actions logs for web deployment issues
- Use Android Studio build logs for mobile issues
- Monitor container logs for runtime errors
- Consult platform-specific documentation

## Resources

- [Scaleway Container Documentation](https://www.scaleway.com/en/docs/containers/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapters)