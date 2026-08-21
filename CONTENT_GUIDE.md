# Video Portfolio Content Guide

Welcome to your new video portfolio! This guide will explain how to log in, add your real videos, and customize your site details.

## 1. Logging into the Admin Panel

The admin panel is securely hidden and protected by a password.

1. Navigate to: `https://your-website.com/admin`
2. You will automatically be redirected to the login page.
3. Enter the `ADMIN_PASSWORD` you configured during deployment.
4. Once authenticated, you will see your Admin Dashboard with all 7 categories.

## 2. Setting Up ImageKit

To ensure your videos load lightning fast and don't eat up bandwidth limits, we use ImageKit as a global Video CDN.

1. Go to [ImageKit.io](https://imagekit.io/) and create a free account.
2. In your ImageKit dashboard, click **Media Library** on the left menu.
3. Click **Upload** and select the `.mp4` video files from your computer.
4. Once the upload is finished, click on the video in your media library.
5. In the right-hand sidebar, you will see a **URL** (it looks like `https://ik.imagekit.io/your_id/filename.mp4`). Click the "Copy" icon next to it.

## 3. Adding Videos to Your Portfolio

Once you have your ImageKit URL, adding it to your site is easy:

1. Open your Admin Panel and click on the category you want to add the video to (e.g., "Motion Graphics").
2. Fill out the "Add New Video" form:
   - **Title:** The name of the project.
   - **Aspect Ratio:** Choose between Horizontal or Vertical (see section below).
   - **Description:** 1-2 short sentences about the project.
   - **Video URL:** Paste the ImageKit URL you copied earlier.
   - **Tags:** Comma-separated keywords (e.g., `commercial, 3d, vibrant`).
   - **Featured:** Check this box if you want this video's thumbnail to be the cover of the category card on the home page.
3. Click **Add Video**. The site updates instantly.

## 4. Vertical vs. Horizontal Aspect Ratios

When adding a video, you must select the correct aspect ratio:

- **Vertical (9:16):** Perfect for TikTok, Instagram Reels, YouTube Shorts, and UGC Ads. The video will span full-screen on mobile devices and be contained nicely on desktop.
- **Horizontal (16:9):** Perfect for traditional YouTube videos, cinematic brand films, and TV commercials. On mobile devices, this will be centered with a clean black background to avoid ugly cropping.

## 5. Updating Settings & Personal Info

To update the main text on your website:

1. From the Admin Panel, click on **Settings** in the sidebar.
2. Here you can update:
   - **Your Name:** Updates the footer and email links.
   - **Tagline:** The large descriptive text on the homepage.
   - **Contact Email:** Where messages are sent when someone clicks the floating "Contact" button.
   - **Availability:** Toggle the green pulsing "Available for work" dot.
3. Click **Save Settings** to instantly apply the changes across the entire site.
