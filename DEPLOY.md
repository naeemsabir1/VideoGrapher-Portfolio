# Deployment Guide

This project is fully configured and ready for deployment on Vercel. Follow these steps to get your portfolio live.

## 1. Push to GitHub

First, you need to push your local code to a GitHub repository:

1. Initialize git if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Go to [GitHub](https://github.com/new) and create a new repository.
3. Link your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import the GitHub repository you just created.
4. Vercel will automatically detect that this is a **Next.js** project.

## 3. Set Environment Variables

Before clicking "Deploy" in the Vercel dashboard, open the **Environment Variables** section and add the following keys:

- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint (e.g., `https://ik.imagekit.io/YOUR_ID`)
- `ADMIN_PASSWORD`: A secure password of your choosing to protect the admin `/admin` route.

Once added, click **Deploy**.

## 4. Configure ImageKit

If you haven't already set up ImageKit:

1. Sign up for a free account at [ImageKit.io](https://imagekit.io).
2. Go to your Dashboard and find your **URL-endpoint**.
3. Upload your `.mp4` videos directly to the Media Library.
4. Copy the URL of your uploaded videos to use in the portfolio admin panel.

## 5. Add Videos to Your Portfolio

Once your site is live:

1. Navigate to `https://your-domain.vercel.app/admin`
2. Enter the `ADMIN_PASSWORD` you configured in Vercel.
3. Select a category (e.g., Motion Graphics, UGC).
4. Click **Add New Video**.
5. Paste the ImageKit Video URL and fill out the details.
6. The changes will instantly reflect on your live site!
