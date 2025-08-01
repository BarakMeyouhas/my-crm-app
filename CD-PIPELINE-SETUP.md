# CD Pipeline Setup Guide

## 🚀 Overview

This project now includes a comprehensive Continuous Deployment (CD) pipeline that automatically deploys your application to Render when tests pass.

## 📋 Pipeline Components

### 1. **Simple CD Pipeline** (`.github/workflows/cd.yml`)
- **Trigger**: When CI pipeline passes on `main` branch
- **Purpose**: Deploy backend to Render, frontend auto-deploys via Netlify
- **Services**: Backend (Render) + Frontend (Netlify auto-deploy)
- **Features**: Automatic backend deployment, health checks, success notifications

## 🔧 Setup Requirements

### GitHub Secrets Required

You need to configure these secrets in your GitHub repository:

#### **Render API Token**
```
RENDER_TOKEN=your_render_api_token_here
```

#### **Production Environment**
```
RENDER_SERVICE_ID_BACKEND=your_backend_service_id
BACKEND_URL=https://your-backend.onrender.com
# Note: Frontend auto-deploys via Netlify, no additional secrets needed
```

#### **Staging Environment** (Optional - For Future Use)
```
RENDER_SERVICE_ID_BACKEND_STAGING=your_staging_backend_service_id
RENDER_SERVICE_ID_FRONTEND_STAGING=your_staging_frontend_service_id
BACKEND_URL_STAGING=https://your-staging-backend.onrender.com
FRONTEND_URL_STAGING=https://your-staging-frontend.onrender.com
```

## 🛠️ How to Get Render Service IDs

1. **Go to your Render Dashboard**
2. **Select your service** (backend or frontend)
3. **Copy the Service ID** from the URL or service details
4. **Add it to GitHub Secrets**

Example:
- URL: `https://dashboard.render.com/web/srv-abc123def456`
- Service ID: `srv-abc123def456`

## 🔑 How to Get Render API Token

1. **Go to Render Dashboard**
2. **Click on your profile** (top right)
3. **Go to Account Settings**
4. **API Keys section**
5. **Create a new API key**
6. **Copy the token** and add to GitHub Secrets

## 📊 Pipeline Flow

### Production Deployment
```
main branch push → CI Pipeline → Tests Pass → CD Pipeline → Deploy to Production
```

### Simple Deployment
```
main branch push → CI Pipeline → Tests Pass → CD Pipeline → Deploy to Production
```

## 🎯 Usage Examples

### Automatic Deployment
- Push to `main` → Automatic production deployment
- All tests must pass in CI first
- Deployment happens automatically after successful CI

## 🔍 Health Checks

The CD pipeline includes health checks that verify:
- ✅ Backend API is responding
- ✅ Frontend is accessible
- ✅ Database connections work
- ✅ All endpoints are functional

## 🚨 Troubleshooting

### Common Issues

#### **"RENDER_TOKEN not found"**
- Check that `RENDER_TOKEN` is set in GitHub Secrets
- Verify the token is valid and has proper permissions

#### **"Service ID not found"**
- Verify service IDs are correctly set in GitHub Secrets
- Check that the service IDs match your Render services

#### **Deployment fails**
- Check Render service logs
- Verify environment variables in Render
- Ensure database migrations are up to date

#### **Health checks fail**
- Check if services are actually deployed
- Verify URLs are correct in secrets
- Check Render service status

## 🔄 Rollback Process

### When to Rollback
- 🚨 Critical bugs in production
- 🔥 Performance issues
- 🐛 Database migration problems
- ⚠️ Security vulnerabilities

### How to Rollback (Manual Process)
1. **Identify the issue**
2. **Go to Render Dashboard**
3. **Redeploy previous version** or fix the issue
4. **Monitor deployment progress**
5. **Verify the fix works**

## 📈 Monitoring

### Deployment Status
- Check GitHub Actions for deployment status
- Monitor Render dashboard for service health
- Review deployment logs for any issues

### Health Monitoring
- Backend health: `{BACKEND_URL}/api/public/companies`
- Frontend health: `{FRONTEND_URL}`
- Database connectivity
- API endpoint availability

## 🔐 Security Considerations

### Secrets Management
- ✅ All sensitive data stored in GitHub Secrets
- ✅ No hardcoded credentials in code
- ✅ Environment-specific configurations

### Access Control
- ✅ Render API token with minimal required permissions
- ✅ Service-specific deployment tokens
- ✅ Environment isolation

## 🚀 Best Practices

### Development Workflow
1. **Feature branches** → Develop new features
2. **develop branch** → Staging deployment
3. **main branch** → Production deployment

### Deployment Strategy
- ✅ **Blue-Green Deployment**: Zero downtime
- ✅ **Rollback Capability**: Quick recovery
- ✅ **Health Checks**: Verify deployment success
- ✅ **Monitoring**: Track deployment status

### Testing Strategy
- ✅ **CI Pipeline**: All tests must pass
- ✅ **E2E Tests**: Full application testing
- ✅ **API Tests**: Backend functionality
- ✅ **Unit Tests**: Component testing

## 📝 Configuration Files

### Workflow Files
- `.github/workflows/cd.yml` - Simple production deployment

### Environment Files
- `frontend/src/environments/environment.ts` - Development
- `frontend/src/environments/environment.prod.ts` - Production

## 🎉 Success Indicators

### Deployment Success
- ✅ All tests pass in CI
- ✅ CD pipeline completes successfully
- ✅ Health checks pass
- ✅ Services are accessible
- ✅ No errors in deployment logs

### Rollback Success
- ✅ Previous version is restored
- ✅ Services are healthy
- ✅ No data loss
- ✅ Users can access application

---

## 📞 Support

If you encounter issues with the CD pipeline:

1. **Check GitHub Actions logs** for detailed error messages
2. **Verify Render service status** in dashboard
3. **Review this documentation** for common solutions
4. **Check environment variables** in both GitHub and Render
5. **Test manually** if automatic deployment fails 