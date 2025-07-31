# Netlify Deployment Guide

## Prerequisites
- Your Angular frontend is ready for production
- You have a GitHub repository connected to Netlify
- Your backend will be deployed separately (e.g., to Render)

## Step 1: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/start/repos/BarakMeyouhas%2Fmy-crm-app)
2. Click "Connect to Git"
3. Select your repository: `BarakMeyouhas/my-crm-app`
4. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build --prod`
   - **Publish directory**: `dist`

## Step 2: Configure Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
NODE_VERSION=18
```

## Step 3: Update Backend URL

Once your backend is deployed to Render, update the production environment:

1. Edit `frontend/src/environments/environment.prod.ts`
2. Replace `'https://your-backend-api.onrender.com/api'` with your actual Render backend URL

## Step 4: Deploy

1. Push your changes to GitHub
2. Netlify will automatically build and deploy your site
3. Your site will be available at a Netlify subdomain (e.g., `https://your-app-name.netlify.app`)

## Step 5: Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Add your custom domain
3. Configure DNS settings as instructed

## Important Notes

- The `netlify.toml` file handles Angular routing (SPA redirects)
- Environment variables are secure and not exposed to the client
- Your backend API URL should be updated in `environment.prod.ts` after deploying to Render
- The frontend will work independently while you set up the backend deployment

## Troubleshooting

- If build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check that the `dist` folder is being generated correctly 