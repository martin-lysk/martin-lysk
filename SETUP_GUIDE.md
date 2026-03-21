# 🎉 Blog Setup Complete!

Your personal blog is now fully configured and ready to use! Here's what has been set up for you.

## ✅ What's Been Done

### 1. **Docusaurus Installation**
- Installed Docusaurus 3.9.2 with pnpm
- Configured for blog-only setup (no docs)
- Added Mermaid diagram support
- Set up custom Braun-inspired styling

### 2. **Design & Styling**
- Created Dieter Rams/Braun-inspired minimalist design
- Braun orange accent color (#EA580C)
- Clean, readable typography using Inter font
- Dark mode support
- Responsive design for all devices
- Custom CSS in `src/css/custom.css`

### 3. **Landing Page**
- Automatic GitHub profile integration
- Fetches your GitHub avatar and bio
- Displays your GitHub README content
- Call-to-action buttons for GitHub and Blog

### 4. **Blog Structure**
- **One-post-per-folder** structure for better organization
  ```
  blog/
  ├── 2024-03-21-welcome/
  │   ├── 2024-03-21-welcome.md
  │   └── img/
  │       ├── cover.svg
  │       └── sample.svg
  ├── README.md (guide for adding posts)
  ```

### 5. **Sample Content**
- Created a welcome blog post demonstrating:
  - Relative image references
  - Mermaid diagrams
  - Code highlighting
  - Markdown features

### 6. **GitHub Actions**
- Configured automatic deployment to GitHub Pages
- Triggers on push to `main` branch
- Uses pnpm for dependency management

### 7. **Assets**
- Custom favicon (Braun-inspired orange circle)
- Social card image for sharing
- Sample images in blog post

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm start
```

Visit `http://localhost:3000` to see your blog!

### Build for Production

```bash
# Build the static site
pnpm build

# Preview the production build
pnpm serve
```

## 📝 Adding New Blog Posts

1. **Create a new folder** in the `blog/` directory:
   ```
   blog/YYYY-MM-DD-your-post-slug/
   ```

2. **Create your markdown file** inside the folder:
   ```markdown
   ---
   slug: your-post-slug
   title: Your Post Title
   authors: [martin-lysk]
   tags: [tag1, tag2]
   draft: false
   description: Brief description
   image: ./img/cover.svg
   ---

   Your post content here...

   <!-- truncate -->
   ```

3. **Add images** to an `img/` subfolder:
   ```
   blog/YYYY-MM-DD-your-post-slug/
   ├── YYYY-MM-DD-your-post-slug.md
   └── img/
       ├── image1.svg
       └── image2.svg
   ```

4. **Reference images** with relative paths:
   ```markdown
   ![Description](./img/image1.svg)
   ```

## 🎨 Customization

### GitHub Profile
Update the `githubUsername` in `src/pages/index.tsx:42` to change which profile is fetched.

### Styling
Edit `src/css/custom.css` to modify:
- Colors (search for `--braun-orange`)
- Spacing (search for `--spacing-*`)
- Typography
- Component styles

### Configuration
Edit `docusaurus.config.ts` to update:
- Site metadata
- Navigation
- Footer
- Plugin settings

## 🚢 Deploying to GitHub Pages

### First-Time Setup

1. **Push your code** to GitHub (if not already done)

2. **Enable GitHub Pages**:
   - Go to your repository **Settings** > **Pages**
   - Set **Source** to **GitHub Actions**

3. **Push to main**:
   ```bash
   git add .
   git commit -m "Initial blog setup"
   git push origin main
   ```

4. **Wait for deployment**:
   - Go to the **Actions** tab in your repository
   - Wait for the "Deploy to GitHub Pages" workflow to complete
   - Your site will be live at `https://martinlysk.github.io`

### Automatic Deployment
Every time you push to the `main` branch, GitHub Actions will automatically build and deploy your site!

## 📊 Supported Features

### Markdown
- **GitHub-flavored markdown** - tables, task lists, strikethrough
- **Syntax highlighting** - TypeScript, Python, Bash, JavaScript, etc.
- **Footnotes** - `[^1]` and `[^1]: reference`
- **HTML** - embed HTML directly in markdown

### Images
- **Relative paths** - `./img/image.svg`
- **Absolute paths** - `/img/image.svg`
- **External URLs** - `https://example.com/image.png`

### Diagrams
Use Mermaid syntax for diagrams:
\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`

### Code
\`\`\`typescript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 📁 Project Structure

```
martin-lysk/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── blog/                       # Blog posts
│   ├── 2024-03-21-welcome/     # Sample blog post
│   │   ├── 2024-03-21-welcome.md
│   │   └── img/
│   └── README.md               # Blog structure guide
├── src/
│   ├── css/
│   │   └── custom.css          # Braun-inspired styling
│   ├── components/             # Custom React components
│   └── pages/
│       ├── index.tsx           # Homepage (GitHub integration)
│       └── index.module.css    # Homepage styles
├── static/                     # Static assets
│   └── img/
│       ├── favicon.svg
│       └── docusaurus-social-card.svg
├── docusaurus.config.ts        # Docusaurus configuration
├── package.json
├── pnpm-lock.yaml
├── .gitignore
├── README.md                   # Your GitHub profile README
├── BLOG_README.md              # Detailed blog documentation
└── SETUP_GUIDE.md              # This file
```

## 🎯 Next Steps

1. **Customize your GitHub README** - The homepage displays your GitHub README content
2. **Create your first real blog post** - Delete or edit the sample post
3. **Test the deployment** - Push to GitHub and see it live
4. **Add your own images** - Replace the SVG placeholders
5. **Customize the design** - Tweak colors and spacing to your taste
6. **Add more features** - Explore Docusaurus plugins and themes

## 🔧 Useful Commands

```bash
pnpm start          # Start development server (http://localhost:3000)
pnpm build          # Build for production
pnpm serve          # Serve production build locally
pnpm clear          # Clear Docusaurus cache
```

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Mermaid Diagrams](https://mermaid.js.org/intro/)
- [Dieter Rams Design Principles](https://www.vitsoe.com/us/about/good-design)

## 🐛 Troubleshooting

### Build fails
- Run `pnpm clear` to clear the cache
- Delete `node_modules` and run `pnpm install`

### Images not showing
- Check file paths are correct
- Ensure images are in the same folder as the markdown file
- Use relative paths: `./img/image.svg`

### GitHub Actions fails
- Check the Actions tab for error logs
- Ensure GitHub Pages is enabled in Settings
- Verify the workflow file is in `.github/workflows/deploy.yml`

---

**Enjoy your new blog! 🎉**

If you have any questions or need help, check out:
- `BLOG_README.md` - Detailed documentation
- `blog/README.md` - Blog post structure guide
- [Docusaurus Docs](https://docusaurus.io/docs)
