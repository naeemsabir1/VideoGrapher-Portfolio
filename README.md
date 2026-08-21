<div align="center">
  <h1>🎬 The Reel</h1>
  <p><b>A premium, open-source TikTok-style video portfolio template for filmmakers, motion designers, and UGC creators.</b></p>
</div>

<br />

Most video portfolios feel like static, boring resumes. We built **The Reel** because your work deserves to be experienced the way people actually consume media today: immersive, vertical, and instantly engaging. 

Whether you're a commercial director, a motion graphics artist, or a social media manager, this template provides a premium, blazing-fast way to showcase your best work and get hired—**without paying a single cent for hosting.**

## ✨ Why use this template?

- **📱 TikTok-Style Feed**: A buttery-smooth, swipeable vertical video feed built with Framer Motion.
- **🎨 Premium Aesthetic**: Includes subtle paper-grain textures, warm typography (Syne & Inter), and gorgeous micro-interactions.
- **⚙️ Built-in Admin Panel**: No need to touch the code after deployment! Log into your own hidden `/admin` dashboard to easily add, edit, or delete videos.
- **💸 100% Free to Host**: Designed specifically to bypass expensive hosting tiers. We use a completely free modern tech stack.
- **⚡ Insanely Fast**: Built on Next.js 15 (App Router) and optimized for edge performance. 

## 🏗️ The "Zero-Cost" Architecture

We intentionally designed this project to cost **$0/month** to run:
1. **Frontend Hosting**: Deploy to **[Vercel](https://vercel.com/)** or **[Netlify](https://netlify.com/)** on their generous free tiers.
2. **Video Hosting (CDN)**: We integrated **[ImageKit.io](https://imagekit.io/)** which offers a massive free tier for video streaming and thumbnail generation.
3. **Database-less**: No database fees. Content is managed dynamically via a protected JSON file system that updates seamlessly when you use the Admin panel.

---

## 🚀 Quickstart: Make it Yours

Ready to launch your own portfolio? It takes less than 10 minutes.

### 1. Fork & Clone
Start by clicking the **Fork** button at the top of this repository to add it to your GitHub account. Then, clone your forked repo locally.

### 2. Set up ImageKit (Free Video Hosting)
1. Create a free account at [ImageKit.io](https://imagekit.io/).
2. Upload your videos (MP4s work best) to your ImageKit dashboard.
3. Find your **URL Endpoint** (it looks like `https://ik.imagekit.io/your_id`).

### 3. Environment Variables
Duplicate the `.env.example` file and rename it to `.env.local`. Fill it in:
```env
# Your ImageKit URL Endpoint
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID

# Create a secure password for your Admin Dashboard
ADMIN_PASSWORD=your_super_secret_password
```
*(Note: `.env.local` is safely ignored by Git and will never be exposed publicly!)*

### 4. Deploy for Free
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your forked GitHub repository.
3. In the **Environment Variables** section on Vercel, add both `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` and `ADMIN_PASSWORD`.
4. Click **Deploy**. That's it!

---

## 🎥 Managing Your Portfolio

Once your site is live, managing your content is incredibly easy. You don't need to write any code.

1. Navigate to `your-website-url.com/admin`
2. Log in using the `ADMIN_PASSWORD` you set in your environment variables.
3. Use the **Profile Settings** tab to instantly change your name, contact email, social links, and bio.
4. Use the **Category Manager** to upload your ImageKit video URLs, categorize them (Long Form, UI/UX, Motion Graphics, etc.), and write engaging descriptions.

### Best Practices for Video SEO
- Always include clear, descriptive titles for your videos.
- Use the built-in tagging system to highlight the software or camera used (e.g., `#PremierePro`, `#AfterEffects`, `#SonyFX3`).
- Keep videos under 60 seconds for the highest engagement rate, though the player supports long-form content flawlessly!

## 🤝 Contributing & Community
This project is fully open-source. If you're a developer and want to add new features—like new themes, extra layout options, or analytics integrations—feel free to open a Pull Request! 

If you use this template to land a client or a job, we'd love to hear about it. Enjoy your new portfolio! 

---
*Built with ❤️ for the creative community.*
