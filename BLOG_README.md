# Personal Blog - Martin Lysk

A minimalist personal blog built with [Docusaurus](https://docusaurus.io), inspired by Dieter Rams' design philosophy and Braun's timeless aesthetic.

## Features

- 🎨 **Clean, minimalist design** - Dieter Rams/Braun-inspired styling
- 📝 **Markdown support** - Full GitHub-flavored markdown rendering
- 🖼️ **Relative images** - Easy image management with folder-based blog posts
- 📊 **Mermaid diagrams** - Create beautiful diagrams directly in markdown
- 🌙 **Dark mode** - Automatic dark/light theme switching
- 🚀 **Fast and static** - Built with Docusaurus for optimal performance
- 📱 **Responsive** - Works great on all devices
- 🔍 **SEO friendly** - Optimized for search engines

## Tech Stack

- **Framework**: Docusaurus 3.x
- **Package Manager**: pnpm
- **Styling**: Custom CSS with Braun-inspired design
- **Deployment**: GitHub Pages via GitHub Actions
- **Diagrams**: Mermaid.js integration

## Quick Start

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

### Build

```bash
# Build the static site
pnpm build

# Serve the built site locally
pnpm serve
```

## Project Structure

```
martin-lysk/
├── blog/                      # Blog posts
│   ├── 2024-03-21-welcome/    # Individual blog post folder
│   │   ├── 2024-03-21-welcome.md
│   │   └── img/               # Post-specific images
│   └── README.md              # Blog structure guide
├── src/
│   ├── css/
│   │   └── custom.css         # Custom styling (Braun-inspired)
│   ├── components/            # Custom React components
│   └── pages/
│       ├── index.tsx          # Homepage (fetches GitHub profile)
│       └── index.module.css   # Homepage styles
├── static/                    # Static assets
│   └── img/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── docusaurus.config.ts       # Docusaurus configuration
└── package.json
```

## Adding Blog Posts

1. Create a new folder in the `blog/` directory:
   ```
   blog/YYYY-MM-DD-post-slug/
   ```

2. Add your markdown file:
   ```markdown
   ---
   slug: post-slug
   title: Your Post Title
   authors: [martin-lysk]
   tags: [tag1, tag2]
   draft: false
   description: A brief description
   image: ./img/cover.png
   ---

   Your post content here...
   ```

3. Add images to an `img/` subfolder and reference them:
   ```markdown
   ![Description](./img/image.png)
   ```

See [blog/README.md](./blog/README.md) for more details.

## Customization

### Styling

The design uses Braun's color palette and Dieter Rams' minimalist principles. To customize:

- Edit `src/css/custom.css` for global styles
- Modify CSS variables in the `:root` selector for colors and spacing
- The primary accent color is Braun Orange: `#EA580C`

### GitHub Profile

The homepage automatically fetches your GitHub profile and README. To customize:

1. Update the `githubUsername` in `src/pages/index.tsx`
2. Customize your GitHub profile README
3. The site will automatically fetch and display it

### Deployment

The blog is configured to deploy to GitHub Pages via GitHub Actions. To enable:

1. Go to your repository **Settings** > **Pages**
2. Set **Source** to **GitHub Actions**
3. Push to the `main` branch
4. GitHub Actions will automatically build and deploy

The workflow file is at `.github/workflows/deploy.yml`.

## Features Explained

### Mermaid Diagrams

Add diagrams using Mermaid syntax:

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Continue]
    B -->|No| D[Stop]
\`\`\`

### GitHub-Flavored Markdown

All standard GitHub markdown features are supported:

- Tables
- Task lists
- Code highlighting
- Footnotes
- And more!

## Development

### Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Serve production build locally
- `pnpm deploy` - Deploy to GitHub Pages
- `pnpm clear` - Clear Docusaurus cache

### Adding New Features

Docusaurus supports:
- Custom React components
- MDX in markdown files
- Plugins and themes
- SWizzling components for deep customization

See the [Docusaurus docs](https://docusaurus.io/docs) for more.

## License

This project is open source and available under the ISC License.

## Credits

- Built with [Docusaurus](https://docusaurus.io)
- Design inspired by [Dieter Rams](https://en.wikipedia.org/wiki/Dieter_Rams) and [Braun](https://www.braun.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

Enjoy your new blog! 🎉
