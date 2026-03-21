# Blog Structure

This directory contains blog posts organized in a one-post-per-folder structure.

## Adding a New Blog Post

1. Create a new folder with the naming convention: `YYYY-MM-DD-post-slug`
   - Example: `2024-03-21-my-first-post`

2. Inside the folder, create your markdown file (e.g., `YYYY-MM-DD-post-slug.md`)

3. Add an `img` folder for images if needed:
   ```
   2024-03-21-my-first-post/
   ├── 2024-03-21-my-first-post.md
   └── img/
       ├── image1.png
       └── image2.jpg
   ```

4. Reference images in your markdown using relative paths:
   ```markdown
   ![Image Description](./img/image1.png)
   ```

## Front Matter

Each blog post should include front matter:

```yaml
---
slug: post-slug
title: Post Title
authors: [martin-lysk]
tags: [tag1, tag2]
draft: false
description: A brief description
image: ./img/cover.png
---
```

## Supported Features

- **Markdown**: Full GitHub-flavored markdown support
- **Images**: Relative image references
- **Mermaid Diagrams**: Use \`\`\`mermaid code blocks
- **Code Highlighting**: Syntax highlighting for multiple languages
- **Math**: LaTeX support with KaTeX (if configured)

## Tips

- Keep image sizes reasonable (< 500KB per image)
- Use descriptive alt text for accessibility
- Test your post locally before deploying
- Set `draft: true` to work on posts without publishing them
